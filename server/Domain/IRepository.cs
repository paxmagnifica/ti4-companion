using System;
using System.Threading.Tasks;

namespace server.Domain
{
    public interface IRepository
    {
        Task SaveChangesAsync();

        Task<Session> GetById(Guid sessionId);
        Task<Session> GetByIdWithEvents(Guid sessionId);
        Task SaveSessionToListAsync(string sessionListId, Session session);
        void UpdateSession(Session session);
    }
}
