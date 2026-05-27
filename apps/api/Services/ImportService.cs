using api.Data;
using api.DTOs;
using api.Models;
using api.Models.Grades;
using Microsoft.EntityFrameworkCore;

namespace api.Services;

/// <summary>
/// Handles importing climbing data from KAYA CSV exports.
/// </summary>
public class ImportService
{
    private readonly ClimbingLogContext _db;
    private readonly CacheService _cache;
    private readonly AchievementService _achievementService;

    public ImportService(ClimbingLogContext db, CacheService cache, AchievementService achievementService)
    {
        _db = db;
        _cache = cache;
        _achievementService = achievementService;
    }

    /// <summary>
    /// Imports a KAYA CSV export for a user.
    /// </summary>
    public async Task<ImportResultDto> ImportKayaAsync(Stream csvStream, Guid userId, bool overwrite)
    {
        var rows = ParseCsv(csvStream);

        if (overwrite)
        {
            var existingSessions = await _db.Sessions
                .Where(s => s.UserId == userId)
                .ToListAsync();
            _db.Sessions.RemoveRange(existingSessions);
            await _db.SaveChangesAsync();
        }

        // Build duplicate lookup — keyed on (CreatedAt, GradeRank, GradeSystem) for existing ascents
        var existingAscents = await _db.Ascents
            .Include(a => a.Session)
            .Where(a => a.Session.UserId == userId)
            .Select(a => new { a.CreatedAt, a.GradeRank, a.GradeSystem })
            .ToListAsync();

        var existingKeys = existingAscents
            .Select(a => (a.CreatedAt, a.GradeRank, a.GradeSystem))
            .ToHashSet();

        int sessionsCreated = 0;
        int ascentsCreated = 0;
        int rowsSkipped = 0;

        // Group rows by date (date only, ignore time) + gym = one session
        var sessionGroups = rows
            .Where(r => r.IsValid)
            .GroupBy(r => (r.Date.Date, r.Gym));

        foreach (var group in sessionGroups)
        {
            var sessionRows = group.ToList();
            var sessionDate = group.Key.Date;
            var gym = group.Key.Gym;

            // Check if a session already exists for this date + gym
            var existingSession = await _db.Sessions
                .FirstOrDefaultAsync(s =>
                    s.UserId == userId &&
                    s.Location == gym &&
                    s.CreatedAt.Date == sessionDate);

            Session session;
            if (existingSession != null)
            {
                session = existingSession;
            }
            else
            {
                session = new Session
                {
                    Location = gym,
                    Notes = string.Empty,
                    UserId = userId,
                    CreatedAt = DateTime.SpecifyKind(sessionDate, DateTimeKind.Utc),
                };
                _db.Sessions.Add(session);
                await _db.SaveChangesAsync();
                sessionsCreated++;
            }

            foreach (var row in sessionRows)
            {
                var gradeSystem = DetectGradeSystem(row.Grade);
                int gradeRank;
                try
                {
                    gradeRank = GradeComparer.GetGradeRank(gradeSystem, NormalizeGrade(row.Grade));
                }
                catch (ArgumentException)
                {
                    rowsSkipped++;
                    continue;
                }

                var style = gradeSystem == GradeSystem.VScale ? ClimbStyle.Boulder : ClimbStyle.TopRope;
                var height = gradeSystem == GradeSystem.VScale ? 5 : 17;
                var attempts = row.AscentType == "Flash" ? 1 : row.Attempts;
                var title = !string.IsNullOrWhiteSpace(row.ClimbName)
                    ? row.ClimbName
                    : !string.IsNullOrWhiteSpace(row.Color)
                        ? row.Color
                        : "Unnamed Ascent";

                var duplicateKey = (row.Date, gradeRank, gradeSystem);
                if (existingKeys.Contains(duplicateKey))
                {
                    rowsSkipped++;
                    continue;
                }

                var ascent = new Ascent
                {
                    Title = title[..Math.Min(title.Length, 30)],
                    GradeSystem = gradeSystem,
                    GradeRank = gradeRank,
                    Attempts = attempts,
                    Height = height,
                    Style = style,
                    SessionId = session.Id,
                    CreatedAt = row.Date,
                };

                _db.Ascents.Add(ascent);
                existingKeys.Add(duplicateKey);
                ascentsCreated++;
            }

            await _db.SaveChangesAsync();
        }

        rowsSkipped += rows.Count(r => !r.IsValid);
        await _cache.InvalidateInsightsAsync(userId);
        await _achievementService.EvaluateAsync(userId);

        return new ImportResultDto(sessionsCreated, ascentsCreated, rowsSkipped, overwrite);
    }

    /// <summary>
    /// Parses a KAYA CSV stream into a list of raw rows.
    /// </summary>
    private static List<KayaRow> ParseCsv(Stream stream)
    {
        var rows = new List<KayaRow>();
        using var reader = new StreamReader(stream);

        // Skip header
        var header = reader.ReadLine();
        if (header == null) return rows;

        var columns = header.Split(',');
        var colIndex = new Dictionary<string, int>(StringComparer.OrdinalIgnoreCase);
        for (int i = 0; i < columns.Length; i++)
            colIndex[columns[i].Trim()] = i;

        while (!reader.EndOfStream)
        {
            var line = reader.ReadLine();
            if (string.IsNullOrWhiteSpace(line)) continue;

            var fields = line.Split(',');

            try
            {
                var dateStr = GetField(fields, colIndex, "date");
                var date = ParseKayaDate(dateStr);
                if (date == null)
                {
                    rows.Add(KayaRow.Invalid());
                    continue;
                }

                rows.Add(new KayaRow(
                    Date: date.Value,
                    Grade: GetField(fields, colIndex, "grade"),
                    AscentType: GetField(fields, colIndex, "ascent_type"),
                    Attempts: int.TryParse(GetField(fields, colIndex, "attempts"), out var att) ? att : 1,
                    ClimbName: GetField(fields, colIndex, "climb_name"),
                    Color: GetField(fields, colIndex, "color"),
                    Gym: GetField(fields, colIndex, "gym"),
                    IsValid: true
                ));
            }
            catch
            {
                rows.Add(KayaRow.Invalid());
            }
        }

        return rows;
    }

    /// <summary>
    /// Parses KAYA's non-standard date format.
    /// Example: "Sat Jun 15 2024 05:33:44 GMT+0000 (GMT+00:00)"
    /// </summary>
    private static DateTime? ParseKayaDate(string dateStr)
    {
        // Strip the timezone label in parentheses
        var parenIndex = dateStr.IndexOf('(');
        if (parenIndex >= 0)
            dateStr = dateStr[..parenIndex].Trim();

        // dateStr is now: "Sat Jun 15 2024 05:33:44 GMT+0000"
        // Normalize GMT+0000 → GMT+00:00 so zzz format specifier works
        var gmtIndex = dateStr.IndexOf("GMT", StringComparison.Ordinal);
        if (gmtIndex >= 0)
        {
            var offset = dateStr[(gmtIndex + 3)..]; // "+0000" or "-0530" etc.
            if (offset.Length == 5 && !offset.Contains(':'))
                dateStr = dateStr[..(gmtIndex + 3)] + offset[..3] + ":" + offset[3..];
        }

        // dateStr is now: "Sat Jun 15 2024 05:33:44 GMT+00:00"
        if (DateTimeOffset.TryParseExact(
            dateStr,
            "ddd MMM dd yyyy HH:mm:ss 'GMT'zzz",
            System.Globalization.CultureInfo.InvariantCulture,
            System.Globalization.DateTimeStyles.None,
            out var dto))
        {
            return dto.UtcDateTime;
        }

        return null;
    }

    private static string GetField(string[] fields, Dictionary<string, int> colIndex, string name)
    {
        if (!colIndex.TryGetValue(name, out var idx) || idx >= fields.Length)
            return string.Empty;
        return fields[idx].Trim();
    }

    private static GradeSystem DetectGradeSystem(string grade)
    {
        if (grade.StartsWith("v", StringComparison.OrdinalIgnoreCase)) return GradeSystem.VScale;
        if (grade.StartsWith("5.")) return GradeSystem.YDS;
        return GradeSystem.French;
    }

    private static string NormalizeGrade(string grade)
    {
        // v4 → V4, vb → VB
        if (grade.StartsWith("v", StringComparison.OrdinalIgnoreCase))
            return "V" + grade[1..].ToUpperInvariant();
        return grade;
    }

    private record KayaRow(
        DateTime Date,
        string Grade,
        string AscentType,
        int Attempts,
        string ClimbName,
        string Color,
        string Gym,
        bool IsValid
    )
    {
        public static KayaRow Invalid() => new(
            DateTime.MinValue, string.Empty, string.Empty, 0,
            string.Empty, string.Empty, string.Empty, false
        );
    }
}