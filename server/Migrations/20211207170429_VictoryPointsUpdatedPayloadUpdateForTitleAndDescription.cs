using Microsoft.EntityFrameworkCore.Migrations;

namespace server.Migrations
{
    public partial class VictoryPointsUpdatedPayloadUpdateForTitleAndDescription : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("update \"Events\" set \"SerializedPayload\" = '{\"file\":\"' || \"SerializedPayload\" || '\", \"title\": \"\", \"description\": \"\"}' where \"EventType\" = 'TimelineUserEvent'");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // TODO
        }
    }
}
