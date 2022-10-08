using Microsoft.EntityFrameworkCore.Migrations;
using Server.Domain;
using System.Collections.Generic;

namespace Server.Migrations
{
    public partial class AddAgendas : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Agendas",
                columns: table => new
                {
                    Slug = table.Column<string>(type: "text", nullable: false),
                    Type = table.Column<int>(type: "integer", nullable: false),
                    Election = table.Column<int>(type: "integer", nullable: false),
                    ExcludedFrom = table.Column<int>(type: "integer", nullable: true),
                    GameVersion = table.Column<int>(type: "integer", nullable: false),
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Agendas", x => x.Slug);
                });

            var agendas = new List<Agenda>
            {
                new Agenda("anti-intellectual-revolution", GameVersion.Base, AgendaType.Law, ElectionType.None),
                new Agenda("classified-document-leaks", GameVersion.Base, AgendaType.Law, ElectionType.ScoredSecretObjective),
                new Agenda("committee-formation", GameVersion.Base, AgendaType.Law, ElectionType.Player),
                new Agenda("conventions-of-war", GameVersion.Base, AgendaType.Law, ElectionType.None),
                new Agenda("core-mining", GameVersion.Base, AgendaType.Law, ElectionType.HazardousPlanet, GameVersion.PoK),
                new Agenda("demilitarized-zone", GameVersion.Base, AgendaType.Law, ElectionType.CulturalPlanet, GameVersion.PoK),
                new Agenda("enforced-travel-ban", GameVersion.Base, AgendaType.Law, ElectionType.None),
                new Agenda("executive-sanctions", GameVersion.Base, AgendaType.Law, ElectionType.None),
                new Agenda("fleet-regulations", GameVersion.Base, AgendaType.Law, ElectionType.None),
                new Agenda("holy-planet-of-ixth", GameVersion.Base, AgendaType.Law, ElectionType.CulturalPlanet, GameVersion.PoK),
                new Agenda("homeland-defense-act", GameVersion.Base, AgendaType.Law, ElectionType.None),
                new Agenda("imperial-arbiter", GameVersion.Base, AgendaType.Law, ElectionType.Player),
                new Agenda("minister-of-commerce", GameVersion.Base, AgendaType.Law, ElectionType.Player),
                new Agenda("minister-of-exploration", GameVersion.Base, AgendaType.Law, ElectionType.Player),
                new Agenda("minister-of-industry", GameVersion.Base, AgendaType.Law, ElectionType.Player),
                new Agenda("minister-of-peace", GameVersion.Base, AgendaType.Law, ElectionType.Player),
                new Agenda("minister-of-policy", GameVersion.Base, AgendaType.Law, ElectionType.Player),
                new Agenda("minister-of-sciences", GameVersion.Base, AgendaType.Law, ElectionType.Player),
                new Agenda("minister-of-war", GameVersion.Base, AgendaType.Law, ElectionType.Player),
                new Agenda("prophecy-of-ixth", GameVersion.Base, AgendaType.Law, ElectionType.Player),
                new Agenda("publicize-weapon-schematics", GameVersion.Base, AgendaType.Law, ElectionType.None),
                new Agenda("regulated-conscription", GameVersion.Base, AgendaType.Law, ElectionType.None),
                new Agenda("representative-government-base", GameVersion.Base, AgendaType.Law, ElectionType.None),
                new Agenda("research-team:-biotic", GameVersion.Base, AgendaType.Law, ElectionType.IndustrialPlanet, GameVersion.PoK),
                new Agenda("research-team:cybernetic", GameVersion.Base, AgendaType.Law, ElectionType.IndustrialPlanet),
                new Agenda("research-team:-propulsion", GameVersion.Base, AgendaType.Law, ElectionType.IndustrialPlanet, GameVersion.PoK),
                new Agenda("research-team:-warfare", GameVersion.Base, AgendaType.Law, ElectionType.HazardousPlanet, GameVersion.PoK),
                new Agenda("senate-sanctuary", GameVersion.Base, AgendaType.Law, ElectionType.CulturalPlanet, GameVersion.PoK),
                new Agenda("shard-of-the-throne", GameVersion.Base, AgendaType.Law, ElectionType.Player, GameVersion.PoK),
                new Agenda("shared-research", GameVersion.Base, AgendaType.Law, ElectionType.None),
                new Agenda("terraforming-initiative", GameVersion.Base, AgendaType.Law, ElectionType.HazardousPlanet, GameVersion.PoK),
                new Agenda("the-crown-of-emphidia", GameVersion.Base, AgendaType.Law, ElectionType.Player, GameVersion.PoK),
                new Agenda("the-crown-of-thalnos", GameVersion.Base, AgendaType.Law, ElectionType.Player, GameVersion.PoK),
                new Agenda("wormhole-reconstruction", GameVersion.Base, AgendaType.Law, ElectionType.None),
                new Agenda("archived-secret", GameVersion.Base, AgendaType.Directive, ElectionType.Player),
                new Agenda("arms-reduction", GameVersion.Base, AgendaType.Directive, ElectionType.None),
                new Agenda("colonial-redistribution", GameVersion.Base, AgendaType.Directive, ElectionType.NonHomeNonMecatolRexPlanet),
                new Agenda("compensated-disarmament", GameVersion.Base, AgendaType.Directive, ElectionType.Planet),
                new Agenda("economic-equality", GameVersion.Base, AgendaType.Directive, ElectionType.None),
                new Agenda("incentive-program", GameVersion.Base, AgendaType.Directive, ElectionType.None),
                new Agenda("ixthian-artifact", GameVersion.Base, AgendaType.Directive, ElectionType.None),
                new Agenda("judicial-abolishment", GameVersion.Base, AgendaType.Directive, ElectionType.Law),
                new Agenda("miscount-disclosed", GameVersion.Base, AgendaType.Directive, ElectionType.Law),
                new Agenda("mutiny", GameVersion.Base, AgendaType.Directive, ElectionType.None),
                new Agenda("new-constitution", GameVersion.Base, AgendaType.Directive, ElectionType.None),
                new Agenda("public-execution", GameVersion.Base, AgendaType.Directive, ElectionType.Player),
                new Agenda("seed-of-an-empire", GameVersion.Base, AgendaType.Directive, ElectionType.None),
                new Agenda("swords-to-plowshares", GameVersion.Base, AgendaType.Directive, ElectionType.None),
                new Agenda("unconventional-measures", GameVersion.Base, AgendaType.Directive, ElectionType.None),
                new Agenda("wormhole-research", GameVersion.Base, AgendaType.Directive, ElectionType.None),
                new Agenda("articles-of-war", GameVersion.PoK, AgendaType.Law, ElectionType.None),
                new Agenda("checks-and-balances", GameVersion.PoK, AgendaType.Law, ElectionType.None),
                new Agenda("nexus-sovereignty", GameVersion.PoK, AgendaType.Law, ElectionType.None),
                new Agenda("political-censure", GameVersion.PoK, AgendaType.Law, ElectionType.Player),
                new Agenda("representative-government-pok", GameVersion.PoK, AgendaType.Law, ElectionType.None),
                new Agenda("search-warrant", GameVersion.PoK, AgendaType.Law, ElectionType.Player),
                new Agenda("armed-forces-standardization", GameVersion.PoK, AgendaType.Directive, ElectionType.Player),
                new Agenda("clandestine-operations", GameVersion.PoK, AgendaType.Directive, ElectionType.None),
                new Agenda("covert-legislation", GameVersion.PoK, AgendaType.Directive, ElectionType.None),
                new Agenda("galactic-crisis-pact", GameVersion.PoK, AgendaType.Directive, ElectionType.StrategyCard),
                new Agenda("minister-of-antiques", GameVersion.PoK, AgendaType.Directive, ElectionType.Player),
                new Agenda("rearmament-agreement", GameVersion.PoK, AgendaType.Directive, ElectionType.None),
                new Agenda("research-grant-reallocation", GameVersion.PoK, AgendaType.Directive, ElectionType.Player),
            };

            foreach (var agenda in agendas)
            {
                migrationBuilder.InsertData("Agendas", new string[] { "Slug", "GameVersion", "Type", "Election", "ExcludedFrom" }, new string[] { "text", "integer", "integer", "integer", "integer" }, new object[] { agenda.Slug, (int)agenda.GameVersion, (int)agenda.Type, (int)agenda.Election, (int?)agenda.ExcludedFrom });
            }
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Agendas");
        }
    }
}
