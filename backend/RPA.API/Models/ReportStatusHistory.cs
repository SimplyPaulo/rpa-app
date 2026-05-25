using System.ComponentModel.DataAnnotations;
using RPA.API.Enums;

namespace RPA.API.Models;

/// <summary>
/// Records a single status-change event for a report.
/// Together, these entries form the visual timeline:
/// Recebido → Em análise → Em andamento → Concluído.
/// </summary>
public class ReportStatusHistory
{
    /// <summary>Primary key, auto-generated GUID.</summary>
    public Guid Id { get; set; }

    // ── Foreign Key ─────────────────────────────────────────────
    /// <summary>FK to the report this status change belongs to.</summary>
    [Required]
    public Guid ReportId { get; set; }

    /// <summary>The status that was set at this point in time.</summary>
    [Required]
    public ReportStatus Status { get; set; }

    /// <summary>UTC timestamp of when this status change occurred.</summary>
    public DateTime ChangedAt { get; set; } = DateTime.UtcNow;

    /// <summary>Optional observation or comment about this status change (max 500 characters).</summary>
    [MaxLength(500)]
    public string? Notes { get; set; }

    // ── Navigation ──────────────────────────────────────────────
    /// <summary>The report this status change belongs to.</summary>
    public Report Report { get; set; } = null!;
}
