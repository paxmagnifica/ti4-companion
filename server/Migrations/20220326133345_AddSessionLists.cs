
using Microsoft.EntityFrameworkCore.Migrations;
using System;

namespace Server.Migrations
{
    public partial class AddSessionLists : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "SessionLists",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SessionLists", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SessionSessionList",
                columns: table => new
                {
                    SessionListsId = table.Column<string>(type: "text", nullable: false),
                    SessionsId = table.Column<Guid>(type: "uuid", nullable: false),
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SessionSessionList", x => new { x.SessionListsId, x.SessionsId });
                    table.ForeignKey(
                        name: "FK_SessionSessionList_SessionLists_SessionListsId",
                        column: x => x.SessionListsId,
                        principalTable: "SessionLists",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SessionSessionList_Sessions_SessionsId",
                        column: x => x.SessionsId,
                        principalTable: "Sessions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SessionSessionList_SessionsId",
                table: "SessionSessionList",
                column: "SessionsId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SessionSessionList");

            migrationBuilder.DropTable(
                name: "SessionLists");
        }
    }
}
