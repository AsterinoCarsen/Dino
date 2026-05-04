namespace api.DTOs;

public record SessionResponseDto(
    int Id,
    string Location,
    string Notes,
    DateTime CreatedAt,
    ICollection<AscentResponseDto> Ascents
);