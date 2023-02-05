using System;
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

        public List<MapPosition> MapPositions { get; set; }

        public override bool Equals(object obj)
        {
            return obj is MetadataUpdatedPayload payload &&
                   this.SessionDisplayName == payload.SessionDisplayName &&
                   this.IsTTS == payload.IsTTS &&
                   this.IsSplit == payload.IsSplit &&
                   this.SessionStart == payload.SessionStart &&
                   this.SessionEnd == payload.SessionEnd &&
                   this.Duration == payload.Duration &&
                   this.VpCount == payload.VpCount &&
                   EqualityComparer<Dictionary<string, string>>.Default.Equals(this.Colors, payload.Colors);
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(this.SessionDisplayName, this.SessionStart, this.SessionEnd);
        }
    }
}
