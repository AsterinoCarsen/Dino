namespace api.DTOs;

public record UserResponseDto(
    Guid UserId,
    string Username,
    DateTime CreatedAt
);