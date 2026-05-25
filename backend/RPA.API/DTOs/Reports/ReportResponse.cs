namespace RPA.API.DTOs.Reports;

/// <summary>
/// Full report details returned in API responses.
/// </summary>
public class ReportResponse
{
    public Guid Id { get; set; }
    public string ProtocolNumber { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public Guid UserId { get; set; }
    public string UserName { get; set; } = string.Empty;

    /// <summary>Status timeline entries.</summary>
    public List<StatusHistoryItem> StatusHistory { get; set; } = new();
}

/// <summary>
/// A single entry in the status timeline.
/// </summary>
public class StatusHistoryItem
{
    public Guid Id { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime ChangedAt { get; set; }
    public string? Notes { get; set; }
}
