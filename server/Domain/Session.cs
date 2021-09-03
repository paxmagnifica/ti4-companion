using System;
using System.Collections.Generic;

namespace server.Domain
{
  public class Session
  {
    public Guid Id { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public List<string> Factions { get; set; }
  }

  // public class Faction
  // {
    // public Guid Id { get; set; }
    // public string Key { get; set; }
    // public uint Order { get; set; }
  // }
}
