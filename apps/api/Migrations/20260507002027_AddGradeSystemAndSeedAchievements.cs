using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class AddGradeSystemAndSeedAchievements : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "GradeSystem",
                table: "AchievementDefinitions",
                type: "text",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.InsertData(
                table: "AchievementDefinitions",
                columns: new[] { "Id", "Condition", "Description", "GradeSystem", "Threshold", "Title" },
                values: new object[,]
                {
                    { 1, 0, "Log your first ascent.", null, 1, "First Steps" },
                    { 2, 0, "Log 10 ascents.", null, 10, "Getting Started" },
                    { 3, 0, "Log 100 ascents.", null, 100, "Century Climber" },
                    { 4, 0, "Log 500 ascents.", null, 500, "Dedicated" },
                    { 5, 1, "Complete your first session.", null, 1, "First Session" },
                    { 6, 1, "Complete 10 sessions.", null, 10, "Regular" },
                    { 7, 1, "Complete 50 sessions.", null, 50, "Committed" },
                    { 8, 1, "Complete 100 sessions.", null, 100, "Veteran" },
                    { 9, 3, "Climb 100 meters total.", null, 100, "First Steps Up" },
                    { 10, 3, "Climb 1,000 meters total.", null, 1000, "High Achiever" },
                    { 11, 3, "Climb 8,849 meters total.", null, 8849, "Everest" },
                    { 12, 2, "Send a V5 or harder.", "VScale", 6, "Getting Serious" },
                    { 13, 2, "Send a V7 or harder.", "VScale", 8, "Intermediate" },
                    { 14, 2, "Send a V9 or harder.", "VScale", 10, "Advanced" },
                    { 15, 2, "Send a V10 or harder.", "VScale", 11, "Double Digit" },
                    { 16, 2, "Send a 5.11a or harder.", "YDS", 9, "Getting Serious" },
                    { 17, 2, "Send a 5.12a or harder.", "YDS", 13, "Intermediate" },
                    { 18, 2, "Send a 5.13a or harder.", "YDS", 17, "Advanced" },
                    { 19, 2, "Send a 5.14a or harder.", "YDS", 21, "Elite" },
                    { 20, 2, "Send a 7a or harder.", "French", 15, "Getting Serious" },
                    { 21, 2, "Send a 7c or harder.", "French", 19, "Intermediate" },
                    { 22, 2, "Send an 8b or harder.", "French", 23, "Advanced" },
                    { 23, 2, "Send a 9a or harder.", "French", 27, "Elite" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AchievementDefinitions",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "AchievementDefinitions",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "AchievementDefinitions",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "AchievementDefinitions",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "AchievementDefinitions",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "AchievementDefinitions",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "AchievementDefinitions",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "AchievementDefinitions",
                keyColumn: "Id",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "AchievementDefinitions",
                keyColumn: "Id",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "AchievementDefinitions",
                keyColumn: "Id",
                keyValue: 10);

            migrationBuilder.DeleteData(
                table: "AchievementDefinitions",
                keyColumn: "Id",
                keyValue: 11);

            migrationBuilder.DeleteData(
                table: "AchievementDefinitions",
                keyColumn: "Id",
                keyValue: 12);

            migrationBuilder.DeleteData(
                table: "AchievementDefinitions",
                keyColumn: "Id",
                keyValue: 13);

            migrationBuilder.DeleteData(
                table: "AchievementDefinitions",
                keyColumn: "Id",
                keyValue: 14);

            migrationBuilder.DeleteData(
                table: "AchievementDefinitions",
                keyColumn: "Id",
                keyValue: 15);

            migrationBuilder.DeleteData(
                table: "AchievementDefinitions",
                keyColumn: "Id",
                keyValue: 16);

            migrationBuilder.DeleteData(
                table: "AchievementDefinitions",
                keyColumn: "Id",
                keyValue: 17);

            migrationBuilder.DeleteData(
                table: "AchievementDefinitions",
                keyColumn: "Id",
                keyValue: 18);

            migrationBuilder.DeleteData(
                table: "AchievementDefinitions",
                keyColumn: "Id",
                keyValue: 19);

            migrationBuilder.DeleteData(
                table: "AchievementDefinitions",
                keyColumn: "Id",
                keyValue: 20);

            migrationBuilder.DeleteData(
                table: "AchievementDefinitions",
                keyColumn: "Id",
                keyValue: 21);

            migrationBuilder.DeleteData(
                table: "AchievementDefinitions",
                keyColumn: "Id",
                keyValue: 22);

            migrationBuilder.DeleteData(
                table: "AchievementDefinitions",
                keyColumn: "Id",
                keyValue: 23);

            migrationBuilder.AlterColumn<int>(
                name: "GradeSystem",
                table: "AchievementDefinitions",
                type: "integer",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);
        }
    }
}
