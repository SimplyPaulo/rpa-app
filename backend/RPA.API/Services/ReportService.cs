using Microsoft.EntityFrameworkCore;
using RPA.API.Data;
using RPA.API.DTOs.Reports;
using RPA.API.Enums;
using RPA.API.Models;

namespace RPA.API.Services;

/// <summary>
/// Handles report creation (with protocol number generation), retrieval, and status updates.
/// </summary>
public class ReportService : IReportService
{
    private readonly AppDbContext _db;

    public ReportService(AppDbContext db)
    {
        _db = db;
    }

    /// <inheritdoc />
    public async Task<ReportResponse> CreateAsync(Guid userId, CreateReportRequest request, string? imageUrl)
    {
        var protocolNumber = await GenerateProtocolNumberAsync();
        var now = DateTime.UtcNow;

        var report = new Report
        {
            Id = Guid.NewGuid(),
            ProtocolNumber = protocolNumber,
            Description = request.Description.Trim(),
            ImageUrl = imageUrl,
            Latitude = request.Latitude,
            Longitude = request.Longitude,
            Status = ReportStatus.Received,
            CreatedAt = now,
            UpdatedAt = now,
            UserId = userId
        };

        // Create the initial status history entry
        var initialHistory = new ReportStatusHistory
        {
            Id = Guid.NewGuid(),
            ReportId = report.Id,
            Status = ReportStatus.Received,
            ChangedAt = now,
            Notes = "Relatório recebido com sucesso."
        };

        _db.Reports.Add(report);
        _db.ReportStatusHistories.Add(initialHistory);
        await _db.SaveChangesAsync();

        // Fetch the user name for the response
        var user = await _db.Users.FindAsync(userId);

        // Build the response directly (avoids InMemory Include issues)
        var statusLabels = GetStatusLabels();
        return new ReportResponse
        {
            Id = report.Id,
            ProtocolNumber = report.ProtocolNumber,
            Description = report.Description,
            ImageUrl = report.ImageUrl,
            Latitude = report.Latitude,
            Longitude = report.Longitude,
            Status = statusLabels.GetValueOrDefault(report.Status, report.Status.ToString()),
            CreatedAt = report.CreatedAt,
            UpdatedAt = report.UpdatedAt,
            UserId = report.UserId,
            UserName = user?.FullName ?? string.Empty,
            StatusHistory = new List<StatusHistoryItem>
            {
                new()
                {
                    Id = initialHistory.Id,
                    Status = statusLabels.GetValueOrDefault(initialHistory.Status, initialHistory.Status.ToString()),
                    ChangedAt = initialHistory.ChangedAt,
                    Notes = initialHistory.Notes
                }
            }
        };
    }

    /// <inheritdoc />
    public async Task<ReportResponse?> GetByIdAsync(Guid reportId)
    {
        var report = await _db.Reports
            .Include(r => r.User)
            .Include(r => r.StatusHistory)
            .FirstOrDefaultAsync(r => r.Id == reportId);

        if (report == null) return null;

        return MapToResponse(report);
    }

    /// <inheritdoc />
    public async Task<List<ReportResponse>> GetByUserAsync(Guid userId)
    {
        var reports = await _db.Reports
            .Include(r => r.User)
            .Include(r => r.StatusHistory)
            .Where(r => r.UserId == userId)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();

        return reports.Select(MapToResponse).ToList();
    }

    /// <inheritdoc />
    public async Task<List<ReportResponse>> GetAllAsync()
    {
        var reports = await _db.Reports
            .Include(r => r.User)
            .Include(r => r.StatusHistory)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();

        return reports.Select(MapToResponse).ToList();
    }

    /// <inheritdoc />
    public async Task<ReportResponse> UpdateStatusAsync(Guid reportId, UpdateStatusRequest request)
    {
        var report = await _db.Reports
            .Include(r => r.User)
            .Include(r => r.StatusHistory)
            .FirstOrDefaultAsync(r => r.Id == reportId);

        if (report == null)
            throw new KeyNotFoundException("Relatório não encontrado.");

        var newStatus = (ReportStatus)request.Status;

        // Update the report's current status
        report.Status = newStatus;
        report.UpdatedAt = DateTime.UtcNow;

        // Add a new history entry
        var historyEntry = new ReportStatusHistory
        {
            Id = Guid.NewGuid(),
            ReportId = reportId,
            Status = newStatus,
            ChangedAt = DateTime.UtcNow,
            Notes = request.Notes
        };

        report.StatusHistory.Add(historyEntry);
        await _db.SaveChangesAsync();

        return MapToResponse(report);
    }

    // ── Private Helpers ─────────────────────────────────────────

    /// <summary>
    /// Generates a sequential protocol number in the format RPA-{year}-{6-digit}.
    /// Resets the sequence every year.
    /// </summary>
    private async Task<string> GenerateProtocolNumberAsync()
    {
        var currentYear = DateTime.UtcNow.Year;
        var prefix = $"RPA-{currentYear}-";

        // Find the highest protocol number for the current year
        var lastProtocol = await _db.Reports
            .Where(r => r.ProtocolNumber.StartsWith(prefix))
            .OrderByDescending(r => r.ProtocolNumber)
            .Select(r => r.ProtocolNumber)
            .FirstOrDefaultAsync();

        int nextSequence = 1;

        if (lastProtocol != null)
        {
            // Extract the numeric part: "RPA-2026-000042" → "000042" → 42
            var numericPart = lastProtocol.Substring(prefix.Length);
            if (int.TryParse(numericPart, out int lastSequence))
            {
                nextSequence = lastSequence + 1;
            }
        }

        return $"{prefix}{nextSequence:D6}";
    }

    /// <summary>
    /// Maps a Report entity to a ReportResponse DTO.
    /// </summary>
    private static ReportResponse MapToResponse(Report report)
    {
        var statusLabels = GetStatusLabels();

        return new ReportResponse
        {
            Id = report.Id,
            ProtocolNumber = report.ProtocolNumber,
            Description = report.Description,
            ImageUrl = report.ImageUrl,
            Latitude = report.Latitude,
            Longitude = report.Longitude,
            Status = statusLabels.GetValueOrDefault(report.Status, report.Status.ToString()),
            CreatedAt = report.CreatedAt,
            UpdatedAt = report.UpdatedAt,
            UserId = report.UserId,
            UserName = report.User?.FullName ?? string.Empty,
            StatusHistory = report.StatusHistory
                .OrderBy(h => h.ChangedAt)
                .Select(h => new StatusHistoryItem
                {
                    Id = h.Id,
                    Status = statusLabels.GetValueOrDefault(h.Status, h.Status.ToString()),
                    ChangedAt = h.ChangedAt,
                    Notes = h.Notes
                })
                .ToList()
        };
    }

    /// <summary>
    /// Returns the mapping of ReportStatus enum values to Portuguese labels.
    /// </summary>
    private static Dictionary<ReportStatus, string> GetStatusLabels()
    {
        return new Dictionary<ReportStatus, string>
        {
            { ReportStatus.Received, "Recebido" },
            { ReportStatus.UnderReview, "Em análise" },
            { ReportStatus.InProgress, "Em andamento" },
            { ReportStatus.Completed, "Concluído" }
        };
    }
}
