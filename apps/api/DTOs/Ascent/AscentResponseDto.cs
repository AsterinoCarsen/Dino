using api.Models;
using api.Models.Grades;

namespace api.DTOs;

public record AscentResponseDto(
    int Id,
    string Title,
    string GradeSystem,
    string Grade,
    string Style,
    int Height,
    int Attempts,
    int SessionId,
    DateTime CreatedAt
);