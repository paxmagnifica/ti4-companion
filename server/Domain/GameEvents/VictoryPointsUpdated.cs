
using Newtonsoft.Json;
using server.Domain.Exceptions;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Server.Domain
{
    public enum VictoryPointSource
    {
        Other,
        Objective,
        Custodian,
        SupportForTheThrone,
        Emphidia,
        ShardOfTheThrone,
        Mecatol,
    }

    public class VictoryPointsUpdated : IHandler
    {
        private readonly IRepository repository;

        public VictoryPointsUpdated(IRepository repository)
        {
            this.repository = repository;
        }

        public static VictoryPointsUpdatedPayload GetPayload(GameEvent gameEvent)
        {
            return JsonConvert.DeserializeObject<VictoryPointsUpdatedPayload>(gameEvent.SerializedPayload);
        }

        public static VictoryPointsUpdatedPayload GetPayload(string serializedPayload)
        {
            return JsonConvert.DeserializeObject<VictoryPointsUpdatedPayload>(serializedPayload);
        }

        public async Task Handle(GameEvent gameEvent)
        {
            var session = await this.repository.GetByIdWithEvents(gameEvent.SessionId);

            if (session.Events == null)
            {
                session.Events = new List<GameEvent>();
            }

            var payload = GetPayload(gameEvent);

            if (payload.Points < 0)
            {
                throw new Ti4CompanionDomainException("Points cannot be negative");
            }

            session.Events.Add(gameEvent);

            this.repository.UpdateSession(session);

            await this.repository.SaveChangesAsync();
        }
    }

    public class VictoryPointsUpdatedPayload
    {
        public string Faction { get; set; }

        public int Points { get; set; }

        public VictoryPointSource Source { get; set; }

        public string Context { get; set; }
    }
}
