using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using server.Domain;

namespace server
{
  public class SessionContext : DbContext
  {
    public SessionContext (DbContextOptions<SessionContext> options)
            : base(options)
        {
        }

    public DbSet<Session> Sessions { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
            => optionsBuilder.UseNpgsql("Host=localhost;Database=ti4-companion;Username=postgres;Password=companion");
  }
}
