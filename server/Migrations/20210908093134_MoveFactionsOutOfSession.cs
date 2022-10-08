using Microsoft.EntityFrameworkCore.Migrations;
using System.Collections.Generic;

namespace Server.Migrations
{
    public partial class MoveFactionsOutOfSession : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Factions",
                table: "Sessions");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<List<string>>(
                name: "Factions",
                table: "Sessions",
                type: "text[]",
                nullable: true);
        }
    }
}
