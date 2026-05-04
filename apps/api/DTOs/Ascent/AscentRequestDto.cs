using api.Models;
using api.Models.Grades;

namespace api.DTOs;

public record AscentRequestDto(
    string Title,
    GradeSystem GradeSystem,
    string Grade,
    ClimbStyle Style,
    int Height,
    int Attempts,
    int SessionId
);