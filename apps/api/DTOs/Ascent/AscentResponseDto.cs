using api.Models;
using api.Models.Grades;

namespace api.DTOs;

public record AscentResponseDto(
    int Id,
    string Title,
    GradeSystem GradeSystem,
    string Grade,
    ClimbStyle Style,
    int Height,
    int Attempts,
    int SessionId,
    DateTime CreatedAt
);