using System.Collections.Generic;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace server.Domain
{
    public class MetadataUpdated: IHandler
    {
        private readonly IRepository _repository;

        public MetadataUpdated(IRepository repository)
        {
            _repository = repository;
        }

        public async Task Handle(GameEvent gameEvent)
        {
            var payload = GetPayload(gameEvent);
            var sanitizedPayload = Sanitize(payload);
            Validate(sanitizedPayload);

            var session = await _repository.GetByIdWithEvents(gameEvent.SessionId);

            if (session.Events == null)
            {
                session.Events = new List<GameEvent>();
            }
            session.Events.Add(new GameEvent {
                Id = gameEvent.Id,
                SessionId = gameEvent.SessionId,
                HappenedAt = gameEvent.HappenedAt,
                EventType = gameEvent.EventType,
                SerializedPayload = JsonConvert.SerializeObject(sanitizedPayload),
            });

            _repository.UpdateSession(session);

            await _repository.SaveChangesAsync();
        }

        // TODO add tests
        private MetadataUpdatedPayload Sanitize(MetadataUpdatedPayload payload)
        {
            return new MetadataUpdatedPayload {
                SessionDisplayName = payload.SessionDisplayName,
                IsTTS = payload.IsTTS,
                IsSplit = payload.IsSplit,
                SessionStart = payload.SessionStart,
                SessionEnd = payload.IsSplit ? payload.SessionEnd : string.Empty,
                Duration = payload.Duration,
                VpCount = payload.VpCount > 0 ? payload.VpCount : 10,
            };
        }

        private void Validate(MetadataUpdatedPayload payload)
        {
            // TODO TDD this stuff:
            // TODO validate format of start and end (if and present)
            // TODO validate if end >= start (if end present)
            // TODO validate that VpCount > 10 && VpCount <= 14
        }

        internal static MetadataUpdatedPayload GetPayload(GameEvent gameEvent)
        {
            return GetPayload(gameEvent.SerializedPayload);
        }

        internal static MetadataUpdatedPayload GetPayload(string serializedPayload)
        {
            return JsonConvert.DeserializeObject<MetadataUpdatedPayload>(serializedPayload);
        }
    }

    public class MetadataUpdatedPayload
    {
      public string SessionDisplayName { get; set; }
      public bool IsTTS { get; set; }
      public bool IsSplit { get; set; }
      public string SessionStart { get; set; }
      public string SessionEnd { get; set; }
      public decimal Duration { get; set; }
      public int VpCount { get; set; }
    }
}
