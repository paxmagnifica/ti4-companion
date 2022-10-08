
using Microsoft.EntityFrameworkCore;
using server.Domain;
using server.Persistence;
using System;
using System.Threading.Tasks;

namespace Server.Infra
{
    public class Authorization
    {
        private readonly SessionContext sessionContext;
        private readonly ITimeProvider timeProvider;

        public Authorization(SessionContext sesionContext, ITimeProvider timeProvider)
        {
            this.sessionContext = sesionContext;
            this.timeProvider = timeProvider;
        }

        internal async Task<bool> CheckPassword(Guid sessionId, string password)
        {
            if (string.IsNullOrEmpty(password))
            {
                var session = await this.sessionContext.Sessions.FindAsync(sessionId);
                return string.IsNullOrEmpty(session.HashedPassword);
            }

            FormattableString commandText = $"SELECT \"Id\" FROM \"Sessions\" WHERE \"Id\"={sessionId} AND \"HashedPassword\" = crypt({password}, \"HashedPassword\");";
            var rowsAffected = await this.sessionContext.Database.ExecuteSqlInterpolatedAsync(commandText);

            return rowsAffected != 0;
        }

        internal async Task<Token> GenerateTokenFor(Guid sessionId)
        {
            var newToken = new Token
            {
                SessionId = sessionId,
                Value = Guid.NewGuid(),
                Expires = this.timeProvider.Now.AddHours(12),
            };

            await this.sessionContext.Tokens.AddAsync(newToken);
            await this.sessionContext.SaveChangesAsync();

            return newToken;
        }

        internal async Task<bool> ValidateToken(Guid sessionId, Guid secretValue)
        {
            var token = await this.sessionContext.Tokens.FindAsync(secretValue);

            return token != null && token.SessionId == sessionId && this.timeProvider.Now.CompareTo(token.Expires) < 0;
        }
    }
}
