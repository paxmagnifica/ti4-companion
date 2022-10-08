//

using Microsoft.EntityFrameworkCore.Migrations;

namespace Server.Migrations
{
    public partial class GameStartedPayloadUpdate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("update \"Events\" set \"SerializedPayload\" = '{\"SetupType\":\"simple\",\"Factions\":' || \"SerializedPayload\" || ',\"Options\":{}}' where \"EventType\" = 'GameStarted'");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // TODO
        }
    }
}
