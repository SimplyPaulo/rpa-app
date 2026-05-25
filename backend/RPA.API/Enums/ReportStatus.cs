namespace RPA.API.Enums;

/// <summary>
/// Represents the lifecycle stages of an accessibility report.
/// Maps to the visual timeline: Recebido → Em análise → Em andamento → Concluído.
/// </summary>
public enum ReportStatus
{
    /// <summary>Recebido — Report was successfully submitted.</summary>
    Received = 0,

    /// <summary>Em análise — Report is being reviewed by the team.</summary>
    UnderReview = 1,

    /// <summary>Em andamento — Repair/fix work is in progress.</summary>
    InProgress = 2,

    /// <summary>Concluído — The reported issue has been resolved.</summary>
    Completed = 3
}
