using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using server.Domain;
using server.Persistence;

namespace server.Infra
{
    public class Repository: IRepository
    {
        private readonly SessionContext _sessionContext;

        public Repository(SessionContext sesionContext)
        {
            this._sessionContext = sesionContext;
        }

        public async Task<Session> GetById(Guid sessionId)
        {
            return await _sessionContext.Sessions.FindAsync(sessionId);
        }

        public async Task<Session> GetByIdWithEvents(Guid sessionId)
        {
            var session = await _sessionContext.Sessions.FindAsync(sessionId);
            _sessionContext.Entry(session)
                .Collection(session => session.Events)
                .Load();

            return session;
        }

        public Task SaveChangesAsync()
        {
            return _sessionContext.SaveChangesAsync();
        }

        public void UpdateSession(Session session)
        {
            _sessionContext.Entry(session).State = EntityState.Modified;
        }
    }
}
