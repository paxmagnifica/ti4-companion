namespace server.Domain
{
    public enum AgendaType {
        Directive,
        Law,
    }

    public enum ElectionType {
        None,
        ScoredSecretObjective,
        Player,
        HazardousPlanet,
        CulturalPlanet,
        IndustrialPlanet,
        NonHomeNonMecatolRexPlanet,
        Planet,
        Law,
        StrategyCard,
    }

    public class Agenda : Card
    {
        public Agenda() : base()
        {
            ExcludedFrom = null;
        }

        public Agenda(string slug, GameVersion gameVersion, AgendaType type, ElectionType election, GameVersion? excludedFrom = null) : base(slug, gameVersion)
        {
            Type = type;
            Election = election;
            ExcludedFrom = excludedFrom;
        }

        public AgendaType Type { get; set; }
        public ElectionType Election { get; set; }
        public GameVersion? ExcludedFrom { get; set; }
    }
}
