using Microsoft.EntityFrameworkCore.Migrations;

namespace server.Migrations
{
    public partial class AddTechnologiesAndUnits : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Techs",
                columns: table => new
                {
                    Slug = table.Column<string>(type: "text", nullable: false),
                    Type = table.Column<int>(type: "integer", nullable: false),
                    Level = table.Column<int>(type: "integer", nullable: false),
                    Faction = table.Column<string>(type: "text", nullable: false),
                    GameVersion = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey(name: "PK_Techs_Slug_GameVersion", x => new { x.Slug, x.GameVersion });
                });

            migrationBuilder.CreateTable(
                name: "Units",
                columns: table => new
                {
                    Slug = table.Column<string>(type: "text", nullable: false),
                    Level = table.Column<int>(type: "integer", nullable: false),
                    Requirements = table.Column<int[]>(type: "integer[]", nullable: true),
                    Cost = table.Column<int>(type: "integer", nullable: false),
                    Combat = table.Column<int>(type: "integer", nullable: false),
                    CombatDice = table.Column<int>(type: "integer", nullable: false),
                    Move = table.Column<int>(type: "integer", nullable: false),
                    Capacity = table.Column<int>(type: "integer", nullable: false),
                    Production = table.Column<int>(type: "integer", nullable: false),
                    SustainDamage = table.Column<bool>(type: "boolean", nullable: false),
                    PlanetaryShield = table.Column<bool>(type: "boolean", nullable: false),
                    AntiFighterBarrage = table.Column<int>(type: "integer", nullable: false),
                    AntiFighterBarrageDice = table.Column<int>(type: "integer", nullable: false),
                    Bombardment = table.Column<int>(type: "integer", nullable: false),
                    BombardmentDice = table.Column<int>(type: "integer", nullable: false),
                    GameVersion = table.Column<int>(type: "integer", nullable: false),
                    Faction = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey(name: "PK_Units_Slug_GameVersion", x => new { x.Slug, x.GameVersion });
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Techs");

            migrationBuilder.DropTable(
                name: "Units");
        }
    }
}
