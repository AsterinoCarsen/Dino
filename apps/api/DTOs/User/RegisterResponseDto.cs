namespace api.DTOs;

public record RegisterResponseDto(
    Guid UserID,
    string Username,
    DateTime CreatedAt
);