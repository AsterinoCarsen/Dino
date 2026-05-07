using api.Data;
using api.DTOs;
using api.Models;
using api.Models.Grades;
using Microsoft.EntityFrameworkCore;

namespace api.Services;

/// <summary>
/// Handles creating, retrieving, and deleting ascents.
/// </summary>
public class AscentService
{
    private readonly ClimbingLogContext _db;
    private readonly CacheService _cache;
    private readonly AchievementService _achievementService;

    public AscentService(ClimbingLogContext db, CacheService cache, AchievementService achievementService)
    {
        _db = db;
        _cache = cache;
        _achievementService = achievementService;
    }

    /// <summary>
    /// Logs a new ascent, converting the grade label to a rank before storage.
    /// </summary>
    public async Task<AscentResponseDto?> CreateAsync(AscentRequestDto dto, Guid userId)
    {
        // Validate and parse GradeSystem
        if (!Enum.TryParse<GradeSystem>(dto.GradeSystem, ignoreCase: true, out var gradeSystem))
            return null;

        // Validate and parse ClimbStyle
        if (!Enum.TryParse<ClimbStyle>(dto.Style, ignoreCase: true, out var style))
            return null;

        // Validate the session belongs to the user
        var session = await _db.Sessions
            .FirstOrDefaultAsync(s => s.Id == dto.SessionId && s.UserId == userId);
        if (session == null) return null;

        // Validate the grade label is valid within the grade system
        int gradeRank;
        try
        {
            gradeRank = GradeComparer.GetGradeRank(gradeSystem, dto.Grade);
        }
        catch (ArgumentException)
        {
            return null;
        }

        var ascent = new Ascent
        {
            Title = dto.Title,
            GradeSystem = gradeSystem,
            GradeRank = gradeRank,
            Style = style,
            Height = dto.Height,
            Attempts = dto.Attempts,
            SessionId = dto.SessionId
        };

        _db.Ascents.Add(ascent);
        await _db.SaveChangesAsync();
        await InvalidateInsightsCacheAsync(userId);
        await _achievementService.EvaluateAsync(userId);

        return MapToDto(ascent);
    }

    /// <summary>
    /// Deletes an ascent, verifying it belongs to the requesting user via session ownership.
    /// </summary>
    public async Task<bool> DeleteAsync(int id, Guid userId)
    {
        var ascent = await _db.Ascents
            .Include(a => a.Session)
            .FirstOrDefaultAsync(a => a.Id == id && a.Session.UserId == userId);

        if (ascent == null) return false;

        _db.Ascents.Remove(ascent);
        await _db.SaveChangesAsync();
        await InvalidateInsightsCacheAsync(userId);
        return true;
    }

    /// <summary>
    /// Invalidates all insight cache keys for a user after an ascent write.
    /// </summary>
    private async Task InvalidateInsightsCacheAsync(Guid userId)
    {
        await _cache.DeleteAsync($"insights:{userId}:grade-pyramid:all");
        await _cache.DeleteAsync($"insights:{userId}:attempt-ratio:all");
        await _cache.DeleteAsync($"insights:{userId}:volume:month");
        await _cache.DeleteAsync($"insights:{userId}:volume:session");
        // Also delete per-system keys for each grade system
        foreach (var system in Enum.GetValues<GradeSystem>())
        {
            await _cache.DeleteAsync($"insights:{userId}:grade-pyramid:{system}");
            await _cache.DeleteAsync($"insights:{userId}:attempt-ratio:{system}");
        }
    }

    /// <summary>
    /// Maps an Ascent entity to an AscentResponseDto.
    /// </summary>
    private AscentResponseDto MapToDto(Ascent ascent)
    {
        return new AscentResponseDto(
            ascent.Id,
            ascent.Title,
            ascent.GradeSystem.ToString(),
            GradeComparer.GetGradeLabel(ascent.GradeSystem, ascent.GradeRank),
            ascent.Style.ToString(),
            ascent.Height,
            ascent.Attempts,
            ascent.SessionId,
            ascent.CreatedAt
        );
    }
}