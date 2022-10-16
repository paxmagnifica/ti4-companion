using System;
using System.Threading.Tasks;

namespace Server.Domain
{
    public interface IRepository
    {
        Task SaveChangesAsync();

        Task<Session> GetById(Guid sessionId);

        Task<Session> GetByIdWithEvents(Guid sessionId);

        Task SaveSessionToListAsync(string sessionListId, Session session);

        void UpdateSession(Session session);

        Task DeleteSession(Guid sessionId);

        Task RememberSessionInList(string v, Session sessionFromDb);

        Task <bool> SessionExists(Guid sessionId);
    }
}
