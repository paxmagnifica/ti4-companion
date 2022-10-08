using Newtonsoft.Json;
using Server.Domain.Exceptions;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Threading.Tasks;

namespace Server.Domain
{
    public class MetadataUpdated : IHandler
    {
        private readonly IRepository repository;

        public MetadataUpdated(IRepository repository)
        {
            this.repository = repository;
        }

        public async Task Handle(GameEvent gameEvent)
        {
            var payload = GetPayload(gameEvent);
            var sanitizedPayload = this.Sanitize(payload);
            this.Validate(sanitizedPayload);

            var session = await this.repository.GetByIdWithEvents(gameEvent.SessionId);

            if (session.Events == null)
            {
                session.Events = new List<GameEvent>();
            }

            session.Events.Add(new GameEvent
            {
                Id = gameEvent.Id,
                SessionId = gameEvent.SessionId,
                HappenedAt = gameEvent.HappenedAt,
                EventType = gameEvent.EventType,
                SerializedPayload = JsonConvert.SerializeObject(sanitizedPayload),
            });

            this.repository.UpdateSession(session);

            await this.repository.SaveChangesAsync();
        }

        internal static MetadataUpdatedPayload GetPayload(GameEvent gameEvent)
        {
            return GetPayload(gameEvent.SerializedPayload);
        }

        internal static MetadataUpdatedPayload GetPayload(string serializedPayload)
        {
            return JsonConvert.DeserializeObject<MetadataUpdatedPayload>(serializedPayload);
        }

        private MetadataUpdatedPayload Sanitize(MetadataUpdatedPayload payload)
        {
            return new MetadataUpdatedPayload
            {
                SessionDisplayName = payload.SessionDisplayName,
                IsTTS = payload.IsTTS,
                IsSplit = payload.IsSplit,
                SessionStart = payload.SessionStart,
                SessionEnd = payload.IsSplit ? payload.SessionEnd : string.Empty,
                Duration = payload.Duration,
                VpCount = payload.VpCount > 0 ? payload.VpCount : 10,
                Colors = payload.Colors,
            };
        }

        private void Validate(MetadataUpdatedPayload payload)
        {
            if (!string.IsNullOrEmpty(payload.SessionStart))
            {
                DateTime dt;
                var isValid = DateTime.TryParseExact(payload.SessionStart, "yyyy-MM-dd", new CultureInfo("en-GB"), DateTimeStyles.None, out dt);
                if (!isValid)
                {
                    throw new MetadataUpdatedPayloadInvalidException("Invalid session start format");
                }
            }

            if (!string.IsNullOrEmpty(payload.SessionEnd))
            {
                DateTime dt;
                var isValid = DateTime.TryParseExact(payload.SessionEnd, "yyyy-MM-dd", new CultureInfo("en-GB"), DateTimeStyles.None, out dt);
                if (!isValid)
                {
                    throw new MetadataUpdatedPayloadInvalidException("Invalid session end format");
                }
            }

            if (
                !string.IsNullOrEmpty(payload.SessionStart)
                && !string.IsNullOrEmpty(payload.SessionEnd)
                && payload.SessionStart.CompareTo(payload.SessionEnd) > 0)
            {
                throw new MetadataUpdatedPayloadInvalidException("End should occur after start");
            }

            if (payload.VpCount < 10)
            {
                throw new MetadataUpdatedPayloadInvalidException("VP count below 10");
            }

            if (payload.VpCount > 14)
            {
                throw new MetadataUpdatedPayloadInvalidException("VP count above 14");
            }
        }
    }

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
    }
}
