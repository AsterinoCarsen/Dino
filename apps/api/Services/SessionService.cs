using Microsoft.EntityFrameworkCore;

using api.Data;
using api.DTOs;
using api.Models;
using api.Models.Grades;

namespace api.Services;

public class SessionService
{
    private readonly ClimbingLogContext _db;
    private readonly CacheService _cache;

    public SessionService(ClimbingLogContext db, CacheService cache)
    {
        _db = db;
        _cache = cache;
    }

    public async Task<SessionResponseDto> CreateAsync(SessionRequestDto dto, Guid userId)
    {
        var session = new Session
        {
            Location = dto.Location,
            Notes = dto.Notes,
            UserId = userId
        };

        _db.Sessions.Add(session);
        await _db.SaveChangesAsync();

        return new SessionResponseDto(
            session.Id,
            session.Location,
            session.Notes,
            session.CreatedAt,
            []
        );
    }

    public async Task<ICollection<SessionResponseDto>> GetUserSessionsAsync(Guid userId)
    {
        var sessions = await _db.Sessions
            .Include(s => s.Ascents)
            .Where(s => s.UserId == userId)
            .OrderByDescending(s => s.CreatedAt)
            .ToListAsync();

        return sessions.Select(s => new SessionResponseDto(
            s.Id,
            s.Location,
            s.Notes,
            s.CreatedAt,
            s.Ascents
                .OrderByDescending(a => a.GradeRank)
                .Select(a => new AscentResponseDto(
                    a.Id,
                    a.Title,
                    a.GradeSystem.ToString(),
                    GradeComparer.GetGradeLabel(a.GradeSystem, a.GradeRank),
                    a.Style.ToString(),
                    a.Height,
                    a.Attempts,
                    a.SessionId,
                    a.CreatedAt
                )).ToList()
        )).ToList();
    }

    public async Task<SessionResponseDto?> GetSessionById(Guid userId, int sessionId)
    {
        var session = await _db.Sessions
            .Include(s => s.Ascents)
            .FirstOrDefaultAsync(s => s.Id == sessionId && s.UserId == userId);

        if (session == null) return null;

        return new SessionResponseDto(
            session.Id,
            session.Location,
            session.Notes,
            session.CreatedAt,
            session.Ascents
                .OrderByDescending(a => a.GradeRank)
                .Select(a => new AscentResponseDto(
                    a.Id,
                    a.Title,
                    a.GradeSystem.ToString(),
                    GradeComparer.GetGradeLabel(a.GradeSystem, a.GradeRank),
                    a.Style.ToString(),
                    a.Height,
                    a.Attempts,
                    a.SessionId,
                    a.CreatedAt
                )).ToList()
        );
    }

    public async Task<SessionResponseDto?> UpdateAsync(int sessionId, SessionRequestDto dto, Guid userId)
    {
        var session = await _db.Sessions
            .Include(s => s.Ascents)
            .FirstOrDefaultAsync(s => s.Id == sessionId && s.UserId == userId);

        if (session == null) return null;

        session.Location = dto.Location;
        session.Notes = dto.Notes;

        await _db.SaveChangesAsync();

        return new SessionResponseDto(
            session.Id,
            session.Location,
            session.Notes,
            session.CreatedAt,
            session.Ascents
                .OrderByDescending(a => a.GradeRank)
                .Select(a => new AscentResponseDto(
                    a.Id,
                    a.Title,
                    a.GradeSystem.ToString(),
                    GradeComparer.GetGradeLabel(a.GradeSystem, a.GradeRank),
                    a.Style.ToString(),
                    a.Height,
                    a.Attempts,
                    a.SessionId,
                    a.CreatedAt
                )).ToList()
        );
    }

    public async Task<bool> DeleteAsync(int sessionId, Guid userId)
    {
        var session = await _db.Sessions
            .Include(s => s.Ascents)
            .FirstOrDefaultAsync(s => s.Id == sessionId && s.UserId == userId);

        if (session == null) return false;

        _db.Sessions.Remove(session);
        await _db.SaveChangesAsync();
        await _cache.InvalidateInsightsAsync(userId);
        return true;
    }

    /// <summary>
    /// Computes a composite performance percentile for a session relative to all user sessions.
    /// Score = 0.5 * topGradeRank + 0.3 * avgGradeRank + 0.2 * log(ascentCount + 1)
    /// </summary>
    public async Task<SessionSpotlightDto?> GetSpotlightAsync(int sessionId, Guid userId)
    {
        // Verify session belongs to user
        var session = await _db.Sessions
            .Include(s => s.Ascents)
            .FirstOrDefaultAsync(s => s.Id == sessionId && s.UserId == userId);

        if (session == null) return null;

        // Need all sessions with ascents to compute relative percentile
        var allSessions = await _db.Sessions
            .Include(s => s.Ascents)
            .Where(s => s.UserId == userId && s.Ascents.Any())
            .ToListAsync();

        // Need at least 2 sessions with ascents for a meaningful percentile
        if (allSessions.Count < 2)
            return new SessionSpotlightDto(0f, 0f, 1, allSessions.Count);

        var scores = allSessions
            .Select(s => new
            {
                SessionId = s.Id,
                Score = ComputeSessionScore(s.Ascents.ToList())
            })
            .OrderByDescending(s => s.Score)
            .ToList();

        var targetScore = scores.FirstOrDefault(s => s.SessionId == sessionId);
        if (targetScore == null) return null;

        var rank = scores.IndexOf(targetScore) + 1;
        var percentile = (float)rank / scores.Count * 100f;

        return new SessionSpotlightDto(
            Percentile: MathF.Round(percentile, 1),
            CompositeScore: MathF.Round(targetScore.Score, 2),
            SessionRank: rank,
            TotalSessions: scores.Count
        );
    }

    private static float ComputeSessionScore(List<Ascent> ascents)
    {
        if (ascents.Count == 0) return 0f;

        var topGradeRank = ascents.Max(a => NormalizeRank(a.GradeSystem, a.GradeRank));
        var avgGradeRank = ascents.Average(a => NormalizeRank(a.GradeSystem, a.GradeRank));
        var volumeScore = MathF.Log(ascents.Count + 1) / MathF.Log(20f + 1);

        return 0.5f * topGradeRank
            + 0.3f * (float)avgGradeRank
            + 0.2f * volumeScore;
    }

    private static float NormalizeRank(GradeSystem system, int rank)
    {
        var max = system switch
        {
            GradeSystem.VScale => (float)Enum.GetValues<VGrade>().Max(),
            GradeSystem.YDS => (float)Enum.GetValues<YDSGrade>().Max(),
            GradeSystem.French => (float)Enum.GetValues<FrenchGrade>().Max(),
            _ => 1f
        };
        return max == 0 ? 0f : rank / max;
    }
}