using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models;

public class Achievement
{
    [Key]
    public int Id { get; set; }
}