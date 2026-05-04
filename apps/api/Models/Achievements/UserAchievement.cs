using System.ComponentModel.DataAnnotations;

namespace api.Models.Achievements;

/// <summary>
/// Defines which user has what achievement, created by AchievementService.
/// </summary>
public class UserAchievement
{
    [Key]
    public int Id { get; set; }

    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public int AchievementDefinitionId { get; set; }
    public AchievementDefinition AchievementDefinition { get; set; } = null!;

    public DateTime EarnedAt { get; set; } = DateTime.UtcNow;
}