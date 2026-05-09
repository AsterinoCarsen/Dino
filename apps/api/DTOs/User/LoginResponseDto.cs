namespace api.DTOs;

public record LoginResponseDto(
    string Token,
    UserResponseDto User
);