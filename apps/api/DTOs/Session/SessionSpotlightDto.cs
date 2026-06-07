namespace api.DTOs;

/// <summary>
/// Spotlight data for a single session including composite performance percentile.
/// </summary>
public record SessionSpotlightDto(
    float Percentile,
    float CompositeScore,
    int SessionRank,
    int TotalSessions
);