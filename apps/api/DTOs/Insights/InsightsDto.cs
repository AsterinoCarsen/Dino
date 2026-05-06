namespace api.DTOs;

/// <summary>
/// A single grade entry in a grade pyramid.
/// </summary>
public record GradePyramidEntryDto(
    string Grade,
    int Flashes,
    int NonFlashes
);

/// <summary>
/// Grade pyramid for a single grading system.
/// </summary>
public record GradePyramidDto(
    string GradeSystem,
    ICollection<GradePyramidEntryDto> Data
);

/// <summary>
/// Attempt-to-send ratio for a single grade.
/// </summary>
public record AttemptRatioEntryDto(
    string Grade,
    int TotalAscents,
    double AverageAttempts,
    int MinAttempts,
    int MaxAttempts
);

/// <summary>
/// Attempt-to-send ratio for a single grading system.
/// </summary>
public record AttemptRatioDto(
    string GradeSystem,
    ICollection<AttemptRatioEntryDto> Data
);

/// <summary>
/// Volume entry for a single time period.
/// </summary>
public record VolumeEntryDto(
    string Period,
    int TotalHeight,
    int TotalAscents
);

/// <summary>
/// Volume over time response.
/// </summary>
public record VolumeDto(
    string GroupBy,
    ICollection<VolumeEntryDto> Data
);