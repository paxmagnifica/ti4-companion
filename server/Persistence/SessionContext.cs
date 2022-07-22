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
        public DbSet<Exploration> Explorations { get; set; }
        public DbSet<Relic> Relics { get; set; }
        public DbSet<Technology> Techs { get; set; }
        public DbSet<Unit> Units { get; set; }
        public DbSet<Agenda> Agendas { get; set; }
        public DbSet<Token> Tokens { get; set; }
        public DbSet<SessionList> SessionLists { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
                => optionsBuilder.UseNpgsql(_configuration.GetConnectionString("SessionContext"));
    }
}
