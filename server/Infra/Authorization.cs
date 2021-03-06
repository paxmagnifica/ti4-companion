using System;
using System.Threading.Tasks;
using server.Domain;
using server.Persistence;
using Microsoft.EntityFrameworkCore;

namespace server.Infra
{
    public class Authorization
    {
        private readonly SessionContext _sessionContext;
        private readonly ITimeProvider _timeProvider;

        public Authorization(SessionContext sesionContext, ITimeProvider timeProvider)
        {
            _sessionContext = sesionContext;
            _timeProvider = timeProvider;
        }

        internal async Task<bool> CheckPassword(Guid sessionId, string password)
        {
            if (string.IsNullOrEmpty(password))
            {
                var session = await _sessionContext.Sessions.FindAsync(sessionId);
                return string.IsNullOrEmpty(session.HashedPassword);
            }

            FormattableString commandText = $"SELECT \"Id\" FROM \"Sessions\" WHERE \"Id\"={sessionId} AND \"HashedPassword\" = crypt({password}, \"HashedPassword\");";
            var rowsAffected = await _sessionContext.Database.ExecuteSqlInterpolatedAsync(commandText);

            return rowsAffected != 0;
        }

        internal async Task<Token> GenerateTokenFor(Guid sessionId)
        {
            var newToken = new Token
            {
                SessionId = sessionId,
                Value = Guid.NewGuid(),
                Expires = _timeProvider.Now.AddHours(12)
            };

            await _sessionContext.Tokens.AddAsync(newToken);
            await _sessionContext.SaveChangesAsync();

            return newToken;
        }

        internal async Task<bool> ValidateToken(Guid sessionId, Guid secretValue)
        {
            var token = await _sessionContext.Tokens.FindAsync(secretValue);

            return token != null && token.SessionId == sessionId && _timeProvider.Now.CompareTo(token.Expires) < 0;
        }
    }
}
