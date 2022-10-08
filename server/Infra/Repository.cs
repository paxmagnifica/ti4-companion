using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using server.Domain;
using server.Persistence;

namespace server.Infra
{
    public class Repository : IRepository
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
            if (session == null)
            {
                return null;
            }

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

        public async Task SaveSessionToListAsync(string sessionListId, Session newSession)
        {
            var sessionList = await _sessionContext.SessionLists.FindAsync(sessionListId);
            newSession.SessionLists = new List<SessionList>() { sessionList };
            _sessionContext.Sessions.Add(newSession);
        }

        public async Task RememberSessionInList(string sessionListId, Session sessionFromDb)
        {
            var sessionList = await _sessionContext.SessionLists.FindAsync(sessionListId);
            if (sessionList == null)
            {
                // hum?
                return;
            }

            await _sessionContext.Entry(sessionFromDb)
                .Collection(s => s.SessionLists)
                .LoadAsync();
            if (!sessionFromDb.SessionLists.Any(sl => sl.Id == sessionListId))
            {
                sessionFromDb.SessionLists.Add(sessionList);
                _sessionContext.Entry(sessionFromDb).State = EntityState.Modified;
            }
        }
    }
}
