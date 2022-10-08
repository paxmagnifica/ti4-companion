
using server.Domain;
using System;
using System.Threading.Tasks;

namespace ServerTests.Mocks
{
    internal class Repository : IRepository
    {
        public Task<Session> GetById(Guid sessionId)
        {
            throw new NotImplementedException();
        }

        public Task<Session> GetByIdWithEvents(Guid sessionId)
        {
            throw new NotImplementedException();
        }

        public Task RememberSessionInList(string v, Session sessionFromDb)
        {
            throw new NotImplementedException();
        }

        public Task SaveChangesAsync()
        {
            throw new NotImplementedException();
        }

        public Task SaveSessionToListAsync(string sessionListId, Session session)
        {
            throw new NotImplementedException();
        }

        public void UpdateSession(Session session)
        {
            throw new NotImplementedException();
        }
    }
}
