namespace SDD.API.Infrastructure;

/// <summary>The one place that works out "now" for the created and changed date columns.</summary>
public static class GulfStandardTime
{
    // The United Arab Emirates uses Gulf Standard Time all year round: UTC plus four hours, no daylight saving (constitution B3).
    private static readonly TimeSpan Offset = TimeSpan.FromHours(4);

    public static DateTime Now(TimeProvider clock) => clock.GetUtcNow().UtcDateTime.Add(Offset);
}
