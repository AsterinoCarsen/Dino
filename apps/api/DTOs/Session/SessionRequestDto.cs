using System.ComponentModel.DataAnnotations;

namespace api.DTOs;

public record SessionRequestDto(
    [MaxLength(75)] string Location,
    [MaxLength(150)] string Notes
);