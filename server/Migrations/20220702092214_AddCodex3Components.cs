using Microsoft.EntityFrameworkCore.Migrations;
using server.Domain;

namespace server.Migrations
{
    public partial class AddCodex3Components : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey("PK_Relics", "Relics");
            migrationBuilder.AddPrimaryKey(
                name: "IX_Relics_Slug_GameVersion",
                table: "Relics",
                columns: new[] { "Slug", "GameVersion" }
            );

            migrationBuilder.DropPrimaryKey("PK_Objectives", "Objectives");
            migrationBuilder.AddPrimaryKey(
                name: "IX_Objectives_Slug_GameVersion",
                table: "Objectives",
                columns: new[] { "Slug", "GameVersion" }
            );

            migrationBuilder.DropPrimaryKey("PK_Explorations", "Explorations");
            migrationBuilder.AddPrimaryKey(
                name: "IX_Explorations_Slug_GameVersion",
                table: "Explorations",
                columns: new[] { "Slug", "GameVersion" }
            );

            migrationBuilder.InsertData(
                table: "Explorations",
                columns: new[] { "Slug", "GameVersion", "PlanetType", "NumberOfCards", "Resources", "Influence" },
                values: new object[,] {
                    { "keleres-ship", (int)GameVersion.PoK_Codex3, (int)PlanetType.Frontier, 2, 0, 0 },
                    { "minor-entropic-field", (int)GameVersion.PoK_Codex3, (int)PlanetType.Frontier, 1, 0, 0 },
                    { "entropic-field", (int)GameVersion.PoK_Codex3, (int)PlanetType.Frontier, 1, 0, 0 },
                    { "major-entropic-field", (int)GameVersion.PoK_Codex3, (int)PlanetType.Frontier, 1, 0, 0 },
                    { "dead-world", (int)GameVersion.PoK_Codex3, (int)PlanetType.Frontier, 1, 0, 0 },
                }
            );

            migrationBuilder.InsertData(
                table: "Objectives",
                columns: new[] { "Slug", "GameVersion", "Secret", "When", "Reward", "Points" },
                values: new object[,] {
                    { "fight-with-precision", (int)GameVersion.PoK_Codex3, true, (int)GamePhase.Action, (int)Reward.VictoryPoint, 1 },
                    { "make-an-example-of-their-world", (int)GameVersion.PoK_Codex3, true, (int)GamePhase.Action, (int)Reward.VictoryPoint, 1 },
                    { "turn-their-fleets-to-dust", (int)GameVersion.PoK_Codex3, true, (int)GamePhase.Action, (int)Reward.VictoryPoint, 1 },
                }
            );
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey("IX_Relics_Slug_GameVersion", "Relics");
            migrationBuilder.AddPrimaryKey(
                name: "PK_Relics",
                table: "Relics",
                columns: new[] { "Slug" }
            );

            migrationBuilder.DropPrimaryKey("IX_Objectives_Slug_GameVersion", "Objectives");
            migrationBuilder.AddPrimaryKey(
                name: "PK_Objectives",
                table: "Objectives",
                columns: new[] { "Slug" }
            );

            migrationBuilder.DropPrimaryKey("IX_Explorations_Slug_GameVersion", "Explorations");
            migrationBuilder.AddPrimaryKey(
                name: "PK_Explorations",
                table: "Explorations",
                columns: new[] { "Slug" }
            );

        }
    }
}
