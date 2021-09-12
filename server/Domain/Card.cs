using System.ComponentModel.DataAnnotations;

namespace server.Domain
{
    public class Card
    {
        public Card()
        {
        }

        public Card(string slug, GameVersion gameVersion)
        {
            Slug = slug;
            GameVersion = gameVersion;
        }

        [Key]
        public string Slug { get; set; }
        public GameVersion GameVersion { get; set; }
    }
}
