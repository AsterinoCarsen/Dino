namespace api.DTOs;

public record AchievementProgressDto(
    int Id,
    string Title,
    string Description,
    string Condition,
    int Threshold,
    string? GradeSystem,
    bool Earned,
    DateTime? EarnedAt,
    int CurrentProgress
);