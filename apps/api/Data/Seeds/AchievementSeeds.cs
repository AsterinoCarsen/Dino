using api.Models.Achievements;
using api.Models.Grades;

namespace api.Data.Seeds;

public static class AchievementSeeds
{
    public static IEnumerable<AchievementDefinition> GetDefinitions() =>
    [
        // TotalAscents
        new() { Id = 1, Title = "First Steps", Description = "Log your first ascent.", Condition = AchievementCondition.TotalAscents, Threshold = 1 },
        new() { Id = 2, Title = "Getting Started", Description = "Log 10 ascents.", Condition = AchievementCondition.TotalAscents, Threshold = 10 },
        new() { Id = 3, Title = "Century Climber", Description = "Log 100 ascents.", Condition = AchievementCondition.TotalAscents, Threshold = 100 },
        new() { Id = 4, Title = "Dedicated", Description = "Log 500 ascents.", Condition = AchievementCondition.TotalAscents, Threshold = 500 },

        // TotalSessions
        new() { Id = 5, Title = "First Session", Description = "Complete your first session.", Condition = AchievementCondition.TotalSessions, Threshold = 1 },
        new() { Id = 6, Title = "Regular", Description = "Complete 10 sessions.", Condition = AchievementCondition.TotalSessions, Threshold = 10 },
        new() { Id = 7, Title = "Committed", Description = "Complete 50 sessions.", Condition = AchievementCondition.TotalSessions, Threshold = 50 },
        new() { Id = 8, Title = "Veteran", Description = "Complete 100 sessions.", Condition = AchievementCondition.TotalSessions, Threshold = 100 },

        // TotalHeight
        new() { Id = 9, Title = "First Steps Up", Description = "Climb 100 meters total.", Condition = AchievementCondition.TotalHeight, Threshold = 100 },
        new() { Id = 10, Title = "High Achiever", Description = "Climb 1,000 meters total.", Condition = AchievementCondition.TotalHeight, Threshold = 1000 },
        new() { Id = 11, Title = "Everest", Description = "Climb 8,849 meters total.", Condition = AchievementCondition.TotalHeight, Threshold = 8849 },

        // HighestGrade - VScale
        new() { Id = 12, Title = "Getting Serious", Description = "Send a V5 or harder.", Condition = AchievementCondition.HighestGrade, Threshold = 6, GradeSystem = GradeSystem.VScale },
        new() { Id = 13, Title = "Intermediate", Description = "Send a V7 or harder.", Condition = AchievementCondition.HighestGrade, Threshold = 8, GradeSystem = GradeSystem.VScale },
        new() { Id = 14, Title = "Advanced", Description = "Send a V9 or harder.", Condition = AchievementCondition.HighestGrade, Threshold = 10, GradeSystem = GradeSystem.VScale },
        new() { Id = 15, Title = "Double Digit", Description = "Send a V10 or harder.", Condition = AchievementCondition.HighestGrade, Threshold = 11, GradeSystem = GradeSystem.VScale },

        // HighestGrade - YDS
        new() { Id = 16, Title = "Getting Serious", Description = "Send a 5.11a or harder.", Condition = AchievementCondition.HighestGrade, Threshold = 9, GradeSystem = GradeSystem.YDS },
        new() { Id = 17, Title = "Intermediate", Description = "Send a 5.12a or harder.", Condition = AchievementCondition.HighestGrade, Threshold = 13, GradeSystem = GradeSystem.YDS },
        new() { Id = 18, Title = "Advanced", Description = "Send a 5.13a or harder.", Condition = AchievementCondition.HighestGrade, Threshold = 17, GradeSystem = GradeSystem.YDS },
        new() { Id = 19, Title = "Elite", Description = "Send a 5.14a or harder.", Condition = AchievementCondition.HighestGrade, Threshold = 21, GradeSystem = GradeSystem.YDS },

        // HighestGrade - French
        new() { Id = 20, Title = "Getting Serious", Description = "Send a 7a or harder.", Condition = AchievementCondition.HighestGrade, Threshold = 15, GradeSystem = GradeSystem.French },
        new() { Id = 21, Title = "Intermediate", Description = "Send a 7c or harder.", Condition = AchievementCondition.HighestGrade, Threshold = 19, GradeSystem = GradeSystem.French },
        new() { Id = 22, Title = "Advanced", Description = "Send an 8b or harder.", Condition = AchievementCondition.HighestGrade, Threshold = 23, GradeSystem = GradeSystem.French },
        new() { Id = 23, Title = "Elite", Description = "Send a 9a or harder.", Condition = AchievementCondition.HighestGrade, Threshold = 27, GradeSystem = GradeSystem.French },
    ];
}