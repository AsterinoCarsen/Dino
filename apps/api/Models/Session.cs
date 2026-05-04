using System.ComponentModel.DataAnnotations;

namespace api.Models;

public class Session
{
    [Key]
    public int Id { get; set; }
    [MaxLength(75)]
    public string Location { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    [MaxLength(150)]
    public string Notes { get; set; } = string.Empty;

    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    public ICollection<Ascent> Ascents { get; set; } = [];
}
