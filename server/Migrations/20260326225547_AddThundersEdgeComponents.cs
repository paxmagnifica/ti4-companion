using Microsoft.EntityFrameworkCore.Migrations;
using Server.Domain;

namespace Server.Migrations
{
    public partial class AddThundersEdgeComponents : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Relics",
                columns: new[] { "Slug", "GameVersion" },
                values: new object[,]
                {
                    { "metali-void-armaments", (int)GameVersion.PoK_Codex4 },
                    { "the-quantumcore", (int)GameVersion.PoK_Codex4 },
                    { "the-silver-flame", (int)GameVersion.PoK_Codex4 },
                    { "lightrail-ordnance", (int)GameVersion.PoK_Codex4 },
                    { "metali-void-shielding", (int)GameVersion.PoK_Codex4 },
                    { "the-triad", (int)GameVersion.PoK_Codex4 },
                    { "heart-of-ixth", (int)GameVersion.PoK_Codex4 },
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
        }
    }
}
