using System.ComponentModel.DataAnnotations;
using RPA.API.Enums;

namespace RPA.API.Models;

/// <summary>
/// Represents an accessibility problem report submitted by a client.
/// Contains description, optional geolocation, image URL, and a unique protocol number.
/// </summary>
public class Report
{
    /// <summary>Primary key, auto-generated GUID.</summary>
    public Guid Id { get; set; }

    /// <summary>
    /// Unique protocol number in the format RPA-yyyy-NNNNNN.
    /// Example: RPA-2026-000001.
    /// </summary>
    [Required]
    [MaxLength(20)]
    public string ProtocolNumber { get; set; } = string.Empty;

    /// <summary>Description of the reported problem (max 500 characters).</summary>
    [Required]
    [MaxLength(500)]
    public string Description { get; set; } = string.Empty;

    /// <summary>URL of the uploaded image (Supabase Storage / Cloudinary). Nullable.</summary>
    [MaxLength(500)]
    public string? ImageUrl { get; set; }

    /// <summary>GPS latitude captured from the browser's Geolocation API. Nullable.</summary>
    public double? Latitude { get; set; }

    /// <summary>GPS longitude captured from the browser's Geolocation API. Nullable.</summary>
    public double? Longitude { get; set; }

    /// <summary>Current status of the report. Defaults to Received.</summary>
    [Required]
    public ReportStatus Status { get; set; } = ReportStatus.Received;

    /// <summary>UTC timestamp of report creation.</summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>UTC timestamp of last update.</summary>
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // ── Foreign Key ─────────────────────────────────────────────
    /// <summary>FK to the user who submitted this report.</summary>
    [Required]
    public Guid UserId { get; set; }

    // ── Navigation ──────────────────────────────────────────────
    /// <summary>The user who submitted this report.</summary>
    public User User { get; set; } = null!;

    /// <summary>Full history of status changes for this report.</summary>
    public ICollection<ReportStatusHistory> StatusHistory { get; set; } = new List<ReportStatusHistory>();
}
