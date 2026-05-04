namespace api.DTOs;

public record UserResponseDto(
    Guid UserID,
    string Username,
    DateTime CreatedAt
);