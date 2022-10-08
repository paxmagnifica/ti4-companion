//

using Microsoft.EntityFrameworkCore.Migrations;

namespace Server.Migrations
{
    public partial class Relics : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Relics",
                columns: table => new
                {
                    Slug = table.Column<string>(type: "text", nullable: false),
                    GameVersion = table.Column<int>(type: "integer", nullable: false),
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Relics", x => x.Slug);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Relics");
        }
    }
}
