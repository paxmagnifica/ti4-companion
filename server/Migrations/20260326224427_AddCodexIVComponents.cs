using Microsoft.EntityFrameworkCore.Migrations;
using Server.Domain;

namespace Server.Migrations
{
    public partial class AddCodexIVComponents : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Relics",
                columns: new[] { "Slug", "GameVersion" },
                values: new object[,]
                {
                    { "circlet-of-the-void", (int)GameVersion.PoK_Codex4 },
                    { "book-of-latvinia", (int)GameVersion.PoK_Codex4 },
                    { "neuraloop", (int)GameVersion.PoK_Codex4 },
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
        }
    }
}
