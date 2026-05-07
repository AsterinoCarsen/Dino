using api.Models;
using api.Models.Achievements;
using Microsoft.EntityFrameworkCore;
using api.Data.Seeds;

namespace api.Data;

public class ClimbingLogContext : DbContext
{
    public ClimbingLogContext(DbContextOptions<ClimbingLogContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Session> Sessions => Set<Session>();
    public DbSet<Ascent> Ascents => Set<Ascent>();
    public DbSet<AchievementDefinition> AchievementDefinitions => Set<AchievementDefinition>();
    public DbSet<UserAchievement> UserAchievements => Set<UserAchievement>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<UserAchievement>()
            .HasIndex(ua => new { ua.UserId, ua.AchievementDefinitionId })
            .IsUnique();

        modelBuilder.Entity<Ascent>()
            .Property(a => a.Style)
            .HasConversion<string>();

        modelBuilder.Entity<Ascent>()
            .Property(a => a.GradeSystem)
            .HasConversion<string>();
        
        modelBuilder.Entity<AchievementDefinition>()
            .Property(a => a.GradeSystem)
            .HasConversion<string>();

        // Seed AchievementDefinitions
        modelBuilder.Entity<AchievementDefinition>()
            .HasData(AchievementSeeds.GetDefinitions());
    }
}