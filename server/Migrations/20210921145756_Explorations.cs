using Microsoft.EntityFrameworkCore.Migrations;

namespace server.Migrations
{
    public partial class Explorations : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Explorations",
                columns: table => new
                {
                    Slug = table.Column<string>(type: "text", nullable: false),
                    PlanetType = table.Column<int>(type: "integer", nullable: false),
                    NumberOfCards = table.Column<int>(type: "integer", nullable: false),
                    Resources = table.Column<int>(type: "integer", nullable: false),
                    Influence = table.Column<int>(type: "integer", nullable: false),
                    GameVersion = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Explorations", x => x.Slug);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Explorations");
        }
    }
}
