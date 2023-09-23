using Server.Domain;
using System.Collections.Generic;
using System.Linq;

namespace Server.Controllers
{
    public class PlayerDto
    {
        public PlayerDto()
        {
            this.AtTable = -1;
        }

        public string PlayerName { get; set; }

        public string Faction { get; set; }

        public string Color { get; set; }

        public bool Speaker { get; set; }

        public int AtTable { get; set; }

        public int Initiative { get; set; }

        public static IEnumerable<PlayerDto> GetPlayers(SessionDto session)
        {
            var factionPicks = session.Draft?.Picks?.Where(p => p.Type == "faction") ?? new PickedPayload[0];
            var tablePicks = session.Draft?.Picks?.Where(p => p.Type == "tablePosition") ?? new PickedPayload[0];

            var picks = session.Factions.Select(faction =>
            {
                var decapitalizedFaction = faction;
                decapitalizedFaction = char.ToLower(decapitalizedFaction[0]) + decapitalizedFaction.Substring(1);
                var playerName = factionPicks.FirstOrDefault(fp => fp.Pick == faction)?.PlayerName;
                var tablePick = tablePicks.FirstOrDefault(tp => tp.PlayerName == playerName)?.Pick;

                return new PlayerDto
                {
                    Faction = faction,
                    PlayerName = playerName,
                    Color = session.Colors?.GetValueOrDefault(faction) ?? session.Colors?.GetValueOrDefault(decapitalizedFaction),
                    Speaker = playerName != null && session.Draft?.Speaker == playerName,
                    AtTable = int.Parse(tablePick ?? "-1"),
                };
            });

            var speaker = session.Draft?.Speaker;

            if (!string.IsNullOrEmpty(speaker) && tablePicks.Any())
            {
                var ordered = tablePicks.OrderBy(tp => int.Parse(tp.Pick));
                var duplicated = ordered.Concat(ordered).ToList();
                var speakerIndex = duplicated.FindIndex(a => a.PlayerName == speaker);

                var inOrderAfterSpeaker = duplicated.Skip(speakerIndex).Take(picks.Count());

                return inOrderAfterSpeaker.Select(orderedPick => picks.First(pick => pick.PlayerName == orderedPick.PlayerName));
            }

            return picks;
        }
    }
}
