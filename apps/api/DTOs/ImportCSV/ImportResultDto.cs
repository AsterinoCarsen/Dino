namespace api.DTOs;

public record ImportResultDto(
    int SessionsCreated,
    int AscentsCreated,
    int RowsSkipped,
    bool Overwrite
);