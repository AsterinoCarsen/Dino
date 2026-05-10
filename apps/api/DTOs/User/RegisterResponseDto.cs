namespace api.DTOs;

public record RegisterResponseDto(
    string Token,
    UserResponseDto User
);