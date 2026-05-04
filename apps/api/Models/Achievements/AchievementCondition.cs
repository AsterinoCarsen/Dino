namespace api.Models.Achievements;

/// <summary>
/// Defines which stat to compare in order to trigger an achievement earned.
/// Used by AchievementService.
/// </summary>
public enum AchievementCondition
{
    TotalAscents,
    TotalSessions,
    HighestGrade,
    ConsecutiveDays,
    TotalHeight
}