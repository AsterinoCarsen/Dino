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
}