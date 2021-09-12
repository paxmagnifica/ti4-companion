using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using server.Domain;

namespace server.Persistence
{
    public class SessionContext : DbContext
    {
        private readonly IConfiguration _configuration;

        public SessionContext(DbContextOptions<SessionContext> options, IConfiguration configuration)
                : base(options)
        {
            _configuration = configuration;
        }

        public DbSet<Objective> Objectives { get; set; }
        public DbSet<Session> Sessions { get; set; }
        public DbSet<GameEvent> Events { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
                => optionsBuilder.UseNpgsql(_configuration.GetConnectionString("SessionContext"));
    }
}
