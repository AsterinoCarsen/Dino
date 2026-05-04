namespace api.DTOs;

public record UserAchievementResponseDto(
    string Title,
    string Description,
    DateTime EarnedAt
);