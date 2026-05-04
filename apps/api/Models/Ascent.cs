using System.ComponentModel.DataAnnotations;
using api.Models.Grades;

namespace api.Models;

public class Ascent
{
    [Key]
    public int Id { get; set; }
    [MaxLength(30)]
    public string Title { get; set; } = string.Empty;
    public GradeSystem GradeSystem { get; set; }
    public int GradeRank { get; set; }
    public int Attempts { get; set; }
    public int Height { get; set; }
    public ClimbStyle Style { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public int SessionId { get; set; }
    public Session Session { get; set; } = null!;
}