using System.ComponentModel.DataAnnotations;

namespace api.Models.Achievements;

/// <summary>
/// Defines a single Achievement that a user can earn.
/// </summary>
/// <remarks>
/// Win conditions are evaluated by AchievementService after each ascension log.
/// The Condition is an enum that determines which stat to compare against Threshold.
/// </remarks>
public class AchievementDefinition
{
    [Key]
    public int Id { get; set; }
    [MaxLength(100)]
    public string Title { get; set; } = string.Empty;
    [MaxLength(255)]
    public string Description { get; set; } = string.Empty;
    public AchievementCondition Condition { get; set; }
    public int Threshold { get; set; }

    public ICollection<UserAchievement> UserAchievements { get; set; } = [];

}