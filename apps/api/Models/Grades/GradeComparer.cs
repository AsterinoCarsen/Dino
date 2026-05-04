namespace api.Models.Grades;

public static class GradeComparer
{
    public static string GetGradeLabel(GradeSystem system, int rank)
    {
        return system switch
        {
            GradeSystem.VScale => ((VGrade)rank).ToString(),
            GradeSystem.YDS => ((YDSGrade)rank).ToString().TrimStart('_').Replace('_', '.'),
            GradeSystem.French => ((FrenchGrade)rank).ToString().TrimStart('_').Replace("_plus", "+").Replace('_', ' '),
            _ => throw new ArgumentException($"Unknown grade system: {system}")
        };
    }

    public static int GetGradeRank(GradeSystem system, string label)
    {
        return system switch
        {
            GradeSystem.VScale => (int)Enum.Parse<VGrade>(label),
            GradeSystem.YDS => (int)Enum.Parse<YDSGrade>("_" + label.Replace('.', '_')),
            GradeSystem.French => (int)Enum.Parse<FrenchGrade>("_" + label.Replace("+", "_plus").Replace(" ", "_")),
            _ => throw new ArgumentException($"Unknown grade system: {system}")
        };
    }

    public static bool IsHarderThan(GradeSystem systemA, int rankA, GradeSystem systemB, int rankB)
    {
        if (systemA != systemB)
            throw new InvalidOperationException("Cannot compare grades across different grading systems.");

        return rankA > rankB;
    }

    public static int GetHighestRank(GradeSystem system, IEnumerable<int> ranks)
    {
        if (!ranks.Any())
            throw new InvalidOperationException("Cannot get highest rank from empty collection.");

        return ranks.Max();
    }
}