namespace Server.Infra
{
    public class EventDto
    {
        public string EventType { get; set; }

        public string SerializedPayload { get; set; }

        public System.Guid Checksum { get; set; }
    }
}
