
using System.ComponentModel.DataAnnotations;

namespace Server.Domain
{
    public class Card
    {
        public Card()
        {
        }

        public Card(string slug, GameVersion gameVersion)
        {
            this.Slug = slug;
            this.GameVersion = gameVersion;
        }

        [Key]
        public string Slug { get; set; }

        public GameVersion GameVersion { get; set; }
    }
}
