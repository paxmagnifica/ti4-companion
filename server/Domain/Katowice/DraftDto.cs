namespace Server.Domain.Katowice
{
    public class DraftDto
    {
        public DraftDto()
        {
            PickBans = new PickBanDto[0];
            InitialPool = new string[0];
            Nominations = new NominationDto[0];
            Draft = new ActualDraftDto[0];
        }

        public string Phase { get; internal set; }
        public PickBanDto[] PickBans { get; internal set; }
        public string[] InitialPool { get; internal set; }
        public NominationDto[] Nominations { get; internal set; }
        public ActualDraftDto[] Draft { get; set; }
    }
}
