namespace api.DTOs;

public record RegisterRequestDto(
    string Username,
    string Password
);