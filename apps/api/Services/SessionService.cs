using Microsoft.EntityFrameworkCore;

using api.Data;
using api.DTOs;
using api.Models;
using api.Models.Grades;

namespace api.Services;

public class SessionService
{
    private readonly ClimbingLogContext _db;

    public SessionService(ClimbingLogContext db)
    {
        _db = db;
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
            .Where(s => s.UserId == userId)
            .ToListAsync();
        
        return sessions.Select(s => new SessionResponseDto(
            s.Id,
            s.Location,
            s.Notes,
            s.CreatedAt,
            []
        )).ToList();
    }

    public async Task<SessionResponseDto> GetSessionById(Guid userId, int sessionId)
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
            session.Ascents.Select(a => new AscentResponseDto(
                a.Id,
                a.Title,
                a.GradeSystem,
                GradeComparer.GetGradeLabel(a.GradeSystem, a.GradeRank),
                a.Style,
                a.Height,
                a.Attempts,
                a.SessionId,
                a.CreatedAt
            )).ToList()
        );
    }
}