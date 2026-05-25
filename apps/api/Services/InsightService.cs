using api.Data;
using api.DTOs;
using api.Models.Grades;
using Microsoft.EntityFrameworkCore;

namespace api.Services;

/// <summary>
/// Computes climbing insights from a user's ascent history.
/// Results are cached in Redis and invalidated on ascent writes.
/// </summary>
public class InsightService
{
    private readonly ClimbingLogContext _db;
    private readonly CacheService _cache;
    private readonly GroqService _groq;

    public InsightService(ClimbingLogContext db, CacheService cache, GroqService groq)
    {
        _db = db;
        _cache = cache;
        _groq = groq;
    }

    /// <summary>
    /// Returns a grade pyramid for each grade system the user has data for,
    /// or just the specified system if gradeSystem is provided.
    /// </summary>
    public async Task<ICollection<GradePyramidDto>> GetGradePyramidAsync(Guid userId, string? gradeSystem = null)
    {
        var cacheKey = $"insights:{userId}:grade-pyramid:{gradeSystem ?? "all"}";
        var summaryCacheKey = $"{cacheKey}:summary";

        var cached = await _cache.GetAsync<ICollection<GradePyramidDto>>(cacheKey);
        if (cached != null) return cached;

        var systems = await GetGradeSystemsAsync(userId, gradeSystem);
        var result = new List<GradePyramidDto>();

        foreach (var system in systems)
        {
            var ascents = await _db.Ascents
                .Include(a => a.Session)
                .Where(a => a.Session.UserId == userId && a.GradeSystem == system)
                .ToListAsync();

            var entries = ascents
                .GroupBy(a => a.GradeRank)
                .OrderBy(g => g.Key)
                .Select(g => new GradePyramidEntryDto(
                    GradeComparer.GetGradeLabel(system, g.Key),
                    g.Count(a => a.Attempts == 1),
                    g.Count(a => a.Attempts > 1)
                ))
                .ToList();

            var aiSummary = await _cache.GetAsync<string>(summaryCacheKey)
                ?? await _groq.GenerateSummaryAsync(
                    $"Grade pyramid data for {system}: {System.Text.Json.JsonSerializer.Serialize(entries)}"
                );

            await _cache.SetAsync(summaryCacheKey, aiSummary);
            result.Add(new GradePyramidDto(system.ToString(), entries, aiSummary));
        }

        await _cache.SetAsync(cacheKey, result);
        return result;
    }

    /// <summary>
    /// Returns average attempts per grade for each grade system,
    /// showing where the user's project zone is.
    /// </summary>
    public async Task<ICollection<AttemptRatioDto>> GetAttemptRatioAsync(Guid userId, string? gradeSystem = null)
    {
        var cacheKey = $"insights:{userId}:attempt-ratio:{gradeSystem ?? "all"}";
        var summaryCacheKey = $"{cacheKey}:summary";

        var cached = await _cache.GetAsync<ICollection<AttemptRatioDto>>(cacheKey);
        if (cached != null) return cached;

        var systems = await GetGradeSystemsAsync(userId, gradeSystem);
        var result = new List<AttemptRatioDto>();

        foreach (var system in systems)
        {
            var ascents = await _db.Ascents
                .Include(a => a.Session)
                .Where(a => a.Session.UserId == userId && a.GradeSystem == system)
                .ToListAsync();

            var entries = ascents
                .GroupBy(a => a.GradeRank)
                .OrderBy(g => g.Key)
                .Select(g => new AttemptRatioEntryDto(
                    GradeComparer.GetGradeLabel(system, g.Key),
                    g.Count(),
                    Math.Round(g.Average(a => a.Attempts), 2),
                    g.Min(a => a.Attempts),
                    g.Max(a => a.Attempts)
                ))
                .ToList();

            var aiSummary = await _cache.GetAsync<string>(summaryCacheKey)
                ?? await _groq.GenerateSummaryAsync(
                    $"Attempt ratio data for {system}: {System.Text.Json.JsonSerializer.Serialize(entries)}"
                );

            await _cache.SetAsync(summaryCacheKey, aiSummary);
            result.Add(new AttemptRatioDto(system.ToString(), entries, aiSummary));
        }

        await _cache.SetAsync(cacheKey, result);
        return result;
    }

    /// <summary>
    /// Returns total height and ascent count grouped by month or session.
    /// </summary>
    public async Task<VolumeDto> GetVolumeAsync(Guid userId, string groupBy = "month")
    {
        var cacheKey = $"insights:{userId}:volume:{groupBy}";
        var summaryCacheKey = $"{cacheKey}:summary";

        var cached = await _cache.GetAsync<VolumeDto>(cacheKey);
        if (cached != null) return cached;

        var ascents = await _db.Ascents
            .Include(a => a.Session)
            .Where(a => a.Session.UserId == userId)
            .ToListAsync();

        List<VolumeEntryDto> entries;

        if (groupBy == "session")
        {
            entries = ascents
                .GroupBy(a => a.SessionId)
                .OrderBy(g => g.Min(a => a.CreatedAt))
                .Select(g => new VolumeEntryDto(
                    g.Min(a => a.CreatedAt).ToString("yyyy-MM-dd"),
                    g.Sum(a => a.Height),
                    g.Count()
                ))
                .ToList();
        }
        else
        {
            entries = ascents
                .GroupBy(a => new { a.CreatedAt.Year, a.CreatedAt.Month })
                .OrderBy(g => g.Key.Year).ThenBy(g => g.Key.Month)
                .Select(g => new VolumeEntryDto(
                    $"{g.Key.Year}-{g.Key.Month:D2}",
                    g.Sum(a => a.Height),
                    g.Count()
                ))
                .ToList();
        }

        var aiSummary = await _cache.GetAsync<string>(summaryCacheKey)
            ?? await _groq.GenerateSummaryAsync(
                $"Climbing volume data grouped by {groupBy}: {System.Text.Json.JsonSerializer.Serialize(entries)}"
            );

        await _cache.SetAsync(summaryCacheKey, aiSummary);

        var result = new VolumeDto(groupBy, entries, aiSummary);
        await _cache.SetAsync(cacheKey, result);
        return result;
    }

    /// <summary>
    /// Returns a high-level summary of the user's climbing stats.
    /// </summary>
    public async Task<SummaryDto> GetSummaryAsync(Guid userId)
    {
        var cacheKey = $"insights:{userId}:summary";
        var summaryCacheKey = $"{cacheKey}:ai";

        var cached = await _cache.GetAsync<SummaryDto>(cacheKey);
        if (cached != null) return cached;

        var ascents = await _db.Ascents
            .Include(a => a.Session)
            .Where(a => a.Session.UserId == userId)
            .ToListAsync();

        var totalSessions = await _db.Sessions
            .CountAsync(s => s.UserId == userId);

        var highestGrades = ascents
            .GroupBy(a => a.GradeSystem)
            .Select(g => new GradeSystemHighDto(
                g.Key.ToString(),
                GradeComparer.GetGradeLabel(g.Key, g.Max(a => a.GradeRank))
            ))
            .ToList();

        var aiSummary = await _cache.GetAsync<string>(summaryCacheKey)
            ?? await _groq.GenerateSummaryAsync(
                $"Climbing summary: {ascents.Count} total ascents across {totalSessions} sessions, " +
                $"highest grades: {System.Text.Json.JsonSerializer.Serialize(highestGrades)}"
            );

        await _cache.SetAsync(summaryCacheKey, aiSummary);

        var result = new SummaryDto(
            ascents.Count,
            totalSessions,
            ascents.Sum(a => a.Height),
            highestGrades,
            aiSummary
        );

        await _cache.SetAsync(cacheKey, result);
        return result;
    }

    /// <summary>
    /// Returns the distinct grade systems the user has ascents in,
    /// filtered to a specific system if provided.
    /// </summary>
    private async Task<ICollection<GradeSystem>> GetGradeSystemsAsync(Guid userId, string? gradeSystem)
    {
        if (gradeSystem != null)
        {
            if (!Enum.TryParse<GradeSystem>(gradeSystem, ignoreCase: true, out var parsed))
                throw new ArgumentException($"Invalid grade system: {gradeSystem}");

            return [parsed];
        }

        return await _db.Ascents
            .Include(a => a.Session)
            .Where(a => a.Session.UserId == userId)
            .Select(a => a.GradeSystem)
            .Distinct()
            .ToListAsync();
    }
}