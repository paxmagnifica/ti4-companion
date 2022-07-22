namespace server.Domain
{
    public class Unit : Card
    {
        public Unit(string slug, GameVersion gameVersion) : base(slug, gameVersion)
        {
        }

        public int Level { get; set; }
        public TechnologyType[] Requirements { get; set; }
        public int Cost { get; set; }
        public int Combat { get; set; }
        public int CombatDice { get; set; }
        public int Move { get; set; }
        public int Capacity { get; set; }
        public int Production { get; set; }
        public bool SustainDamage { get; set; }
        public bool PlanetaryShield { get; set; }
        public int AntiFighterBarrage { get; set; }
        public int AntiFighterBarrageDice { get; set; }
        public int Bombardment { get; set; }
        public int BombardmentDice { get; set; }
    }
}
