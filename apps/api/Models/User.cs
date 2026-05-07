using System.ComponentModel.DataAnnotations;

using api.Models.Achievements;

namespace api.Models;

public class User
{
    [Key]
    public Guid UserId { get; set; } = Guid.NewGuid();

    [MaxLength(30)]
    public string Username { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<Session> Sessions { get; set; } = [];
    public ICollection<UserAchievement> UserAchievements { get; set; } = [];
}
