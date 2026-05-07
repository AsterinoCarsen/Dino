using api.Data;
using api.DTOs;
using Microsoft.EntityFrameworkCore;

namespace api.Services;

/// <summary>
/// Handles user profile retrieval.
/// </summary>
public class UserService
{
    private readonly ClimbingLogContext _db;

    public UserService(ClimbingLogContext db)
    {
        _db = db;
    }

    /// <summary>
    /// Returns the profile of the authenticated user.
    /// </summary>
    public async Task<UserResponseDto?> GetProfileAsync(Guid userId)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.UserId == userId);
        if (user == null) return null;

        return new UserResponseDto(
            user.UserId,
            user.Username,
            user.CreatedAt
        );
    }
}