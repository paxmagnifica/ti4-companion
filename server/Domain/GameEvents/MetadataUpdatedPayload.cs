using System.Collections.Generic;

namespace Server.Domain
{
    public class MetadataUpdatedPayload
    {
        public MetadataUpdatedPayload()
        {
            this.Colors = new Dictionary<string, string>();
        }

        public string SessionDisplayName { get; set; }

        public bool IsTTS { get; set; }

        public bool IsSplit { get; set; }

        public string SessionStart { get; set; }

        public string SessionEnd { get; set; }

        public decimal Duration { get; set; }

        public int VpCount { get; set; }

        public Dictionary<string, string> Colors { get; set; }

        public override bool Equals(object obj)
        {
            return obj is MetadataUpdatedPayload payload &&
                   SessionDisplayName == payload.SessionDisplayName &&
                   IsTTS == payload.IsTTS &&
                   IsSplit == payload.IsSplit &&
                   SessionStart == payload.SessionStart &&
                   SessionEnd == payload.SessionEnd &&
                   Duration == payload.Duration &&
                   VpCount == payload.VpCount &&
                   EqualityComparer<Dictionary<string, string>>.Default.Equals(Colors, payload.Colors);
        }
    }
}
