using System.ComponentModel.DataAnnotations;

namespace api.DTOs;

public record RegisterRequestDto(
    [MaxLength(30)] string Username,
    [MaxLength(100)] string Password
);