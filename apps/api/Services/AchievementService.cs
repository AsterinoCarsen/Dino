using api.Data;
using api.Models.Achievements;
using Microsoft.EntityFrameworkCore;
using api.DTOs;

namespace api.Services;

/// <summary>
/// Evaluates achievement conditions after ascent or session writes
/// and awards any newly unlocked achievements to the user.
/// </summary>
public class AchievementService
{
    private readonly ClimbingLogContext _db;

    public AchievementService(ClimbingLogContext db)
    {
        _db = db;
    }

    /// <summary>
    /// Returns all achievement definitions available in the system.
    /// </summary>
    public async Task<ICollection<AchievementDefinitionResponseDto>> GetAllDefinitionsAsync()
    {
        var definitions = await _db.AchievementDefinitions.ToListAsync();

        return definitions.Select(d => new AchievementDefinitionResponseDto(
            d.Id,
            d.Title,
            d.Description,
            d.Condition.ToString(),
            d.Threshold,
            d.GradeSystem?.ToString()
        )).ToList();
    }

    /// <summary>
    /// Returns all achievements earned by the user.
    /// </summary>
    public async Task<ICollection<UserAchievementResponseDto>> GetEarnedAsync(Guid userId)
    {
        return await _db.UserAchievements
            .Include(ua => ua.AchievementDefinition)
            .Where(ua => ua.UserId == userId)
            .Select(ua => new UserAchievementResponseDto(
                ua.AchievementDefinition.Title,
                ua.AchievementDefinition.Description,
                ua.EarnedAt
            ))
            .ToListAsync();
    }

    /// <summary>
    /// Evaluates all unearned achievements for a user and awards any newly met conditions.
    /// </summary>
    public async Task EvaluateAsync(Guid userId)
    {
        // Get all definitions
        var definitions = await _db.AchievementDefinitions.ToListAsync();

        // Get already earned achievement IDs for this user
        var earnedIds = await _db.UserAchievements
            .Where(ua => ua.UserId == userId)
            .Select(ua => ua.AchievementDefinitionId)
            .ToListAsync();

        // Filter to only unearned
        var unearned = definitions.Where(d => !earnedIds.Contains(d.Id)).ToList();

        if (!unearned.Any()) return;

        // Compute stats once to avoid redundant queries
        var stats = await ComputeUserStatsAsync(userId);

        // Evaluate each unearned definition
        var newlyEarned = new List<UserAchievement>();

        foreach (var definition in unearned)
        {
            if (IsConditionMet(definition, stats))
            {
                newlyEarned.Add(new UserAchievement
                {
                    UserId = userId,
                    AchievementDefinitionId = definition.Id,
                    EarnedAt = DateTime.UtcNow
                });
            }
        }

        if (newlyEarned.Any())
        {
            _db.UserAchievements.AddRange(newlyEarned);
            await _db.SaveChangesAsync();
        }
    }

    /// <summary>
    /// Computes all stats needed for achievement evaluation in a single pass.
    /// </summary>
    private async Task<UserStats> ComputeUserStatsAsync(Guid userId)
    {
        var ascents = await _db.Ascents
            .Include(a => a.Session)
            .Where(a => a.Session.UserId == userId)
            .ToListAsync();

        var sessionCount = await _db.Sessions
            .CountAsync(s => s.UserId == userId);

        return new UserStats
        {
            TotalAscents = ascents.Count,
            TotalSessions = sessionCount,
            TotalHeight = ascents.Sum(a => a.Height),
            HighestRankPerSystem = ascents
                .GroupBy(a => a.GradeSystem)
                .ToDictionary(g => g.Key, g => g.Max(a => a.GradeRank))
        };
    }

    /// <summary>
    /// Evaluates whether a single achievement condition is met given the user's stats.
    /// </summary>
    private bool IsConditionMet(AchievementDefinition definition, UserStats stats)
    {
        return definition.Condition switch
        {
            AchievementCondition.TotalAscents => stats.TotalAscents >= definition.Threshold,
            AchievementCondition.TotalSessions => stats.TotalSessions >= definition.Threshold,
            AchievementCondition.TotalHeight => stats.TotalHeight >= definition.Threshold,
            AchievementCondition.HighestGrade =>
                definition.GradeSystem.HasValue &&
                stats.HighestRankPerSystem.TryGetValue(definition.GradeSystem.Value, out var rank) &&
                rank >= definition.Threshold,
            _ => false
        };
    }

    /// <summary>
    /// Holds precomputed user stats for achievement evaluation.
    /// </summary>
    private class UserStats
    {
        public int TotalAscents { get; set; }
        public int TotalSessions { get; set; }
        public int TotalHeight { get; set; }
        public Dictionary<api.Models.Grades.GradeSystem, int> HighestRankPerSystem { get; set; } = [];
    }
}