using RPA.API.DTOs.Reports;

namespace RPA.API.Services;

/// <summary>
/// Contract for report CRUD operations and status management.
/// </summary>
public interface IReportService
{
    /// <summary>Create a new report and return the generated protocol number.</summary>
    Task<ReportResponse> CreateAsync(Guid userId, CreateReportRequest request, string? imageUrl);

    /// <summary>Get a report by its ID, including status history.</summary>
    Task<ReportResponse?> GetByIdAsync(Guid reportId);

    /// <summary>List all reports created by a specific user.</summary>
    Task<List<ReportResponse>> GetByUserAsync(Guid userId);

    /// <summary>List all reports (for Company dashboard).</summary>
    Task<List<ReportResponse>> GetAllAsync();

    /// <summary>Update the status of a report and record the change in history.</summary>
    Task<ReportResponse> UpdateStatusAsync(Guid reportId, UpdateStatusRequest request);
}
