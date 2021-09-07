using System;
using System.Threading.Tasks;

namespace server.Domain
{
    public interface IRepository
    {
        Task SaveChangesAsync();

        Task<Session> GetById(Guid sessionId);
        void UpdateSession(Session session);
    }
}
