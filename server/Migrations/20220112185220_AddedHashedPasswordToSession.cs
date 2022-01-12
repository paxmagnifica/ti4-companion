using Microsoft.EntityFrameworkCore.Migrations;

namespace server.Migrations
{
    public partial class AddedHashedPasswordToSession : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("CREATE EXTENSION pgcrypto;");
            migrationBuilder.AddColumn<string>(
                name: "HashedPassword",
                table: "Sessions",
                type: "text",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "HashedPassword",
                table: "Sessions");
        }
    }
}
