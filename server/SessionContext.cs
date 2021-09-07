using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using server.Domain;

namespace server
{
    public class SessionContext : DbContext
    {
        private readonly IConfiguration _configuration;

        public SessionContext(DbContextOptions<SessionContext> options, IConfiguration configuration)
                : base(options)
        {
            _configuration = configuration;
        }

        public DbSet<Session> Sessions { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
                => optionsBuilder.UseNpgsql(_configuration.GetConnectionString("SessionContext"));
    }
}
