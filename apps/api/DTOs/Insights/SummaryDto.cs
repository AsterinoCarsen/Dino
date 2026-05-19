public record GradeSystemHighDto(
    string GradeSystem,
    string HighestGrade
);

public record SummaryDto(
    int TotalAscents,
    int TotalSessions,
    int TotalHeight,
    ICollection<GradeSystemHighDto> HighestGrades,
    string? AiSummary
);