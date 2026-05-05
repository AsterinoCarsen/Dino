using System.ComponentModel.DataAnnotations;

using api.Models;
using api.Models.Grades;

namespace api.DTOs;

public record AscentRequestDto(
    [MaxLength(30)] string Title,
    GradeSystem GradeSystem,
    [MaxLength(12)] string Grade,
    ClimbStyle Style,
    [Range(0, 7500)] int Height,
    [Range(0, 1000)] int Attempts,
    int SessionId
);