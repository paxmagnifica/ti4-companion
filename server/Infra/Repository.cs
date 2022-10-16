using Microsoft.EntityFrameworkCore;
using Server.Domain;
using Server.Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.Infra
{
    public class Repository : IRepository
    {
        private readonly SessionContext sessionContext;

        public Repository(SessionContext sesionContext)
        {
            this.sessionContext = sesionContext;
        }

        public async Task<Session> GetById(Guid sessionId)
        {
            return await this.sessionContext.Sessions.FindAsync(sessionId);
        }

        public async Task<Session> GetByIdWithEvents(Guid sessionId)
        {
            var session = await this.sessionContext.Sessions.FindAsync(sessionId);
            if (session == null)
            {
                return null;
            }

            this.sessionContext.Entry(session)
                .Collection(session => session.Events)
                .Load();

            return session;
        }

        public Task SaveChangesAsync()
        {
            return this.sessionContext.SaveChangesAsync();
        }

        public void UpdateSession(Session session)
        {
            this.sessionContext.Entry(session).State = EntityState.Modified;
        }

        public async Task SaveSessionToListAsync(string sessionListId, Session newSession)
        {
            var sessionList = await this.sessionContext.SessionLists.FindAsync(sessionListId);
            newSession.SessionLists = new List<SessionList>() { sessionList };
            this.sessionContext.Sessions.Add(newSession);
        }

        public async Task RememberSessionInList(string sessionListId, Session sessionFromDb)
        {
            var sessionList = await this.sessionContext.SessionLists.FindAsync(sessionListId);
            if (sessionList == null)
            {
                // hum?
                return;
            }

            await this.sessionContext.Entry(sessionFromDb)
                .Collection(s => s.SessionLists)
                .LoadAsync();
            if (!sessionFromDb.SessionLists.Any(sl => sl.Id == sessionListId))
            {
                sessionFromDb.SessionLists.Add(sessionList);
                this.sessionContext.Entry(sessionFromDb).State = EntityState.Modified;
            }
        }

        public async Task DeleteSession(Guid sessionId)
        {
            var session = await this.sessionContext.Sessions.FindAsync(sessionId);

            if (session == null)
            {
                return;
            }

            this.sessionContext.Sessions.Remove(session);
        }

        public async Task<bool> SessionExists(Guid sessionId)
        {
            var sessionExits = await this.sessionContext.Sessions.AnyAsync(x => x.Id == sessionId);

            return sessionExits;
        }
    }
}
