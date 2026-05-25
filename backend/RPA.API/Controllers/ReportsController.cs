using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RPA.API.DTOs.Reports;
using RPA.API.Services;

namespace RPA.API.Controllers;

/// <summary>
/// Manages accessibility problem reports (CRUD).
/// Most endpoints require JWT authentication.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class ReportsController : ControllerBase
{
    private readonly IReportService _reportService;
    private readonly IImageService _imageService;

    public ReportsController(IReportService reportService, IImageService imageService)
    {
        _reportService = reportService;
        _imageService = imageService;
    }

    /// <summary>
    /// POST /api/reports
    /// Creates a new report via multipart/form-data.
    /// Uploads the image to AWS S3 and stores the returned URL.
    /// </summary>
    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Create([FromForm] CreateReportRequest request)
    {
        var userId = GetCurrentUserId();

        // Upload image to AWS S3 (returns null if no file was provided)
        var imageUrl = await _imageService.UploadAsync(request.Image);

        var report = await _reportService.CreateAsync(userId, request, imageUrl);
        return CreatedAtAction(nameof(GetById), new { id = report.Id }, report);
    }

    /// <summary>
    /// GET /api/reports/{id}
    /// Retrieves a single report by ID, including its status timeline.
    /// </summary>
    [Authorize]
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var report = await _reportService.GetByIdAsync(id);
        if (report == null)
            return NotFound(new { message = "Relatório não encontrado." });

        return Ok(report);
    }

    /// <summary>
    /// GET /api/reports/all
    /// Lists all reports from all users. Company access only.
    /// Used in the Company management dashboard.
    /// </summary>
    [Authorize(Roles = "Company")]
    [HttpGet("all")]
    public async Task<IActionResult> GetAllReports()
    {
        var reports = await _reportService.GetAllAsync();
        return Ok(reports);
    }

    /// <summary>
    /// GET /api/reports/my
    /// Lists all reports created by the authenticated user.
    /// </summary>
    [Authorize]
    [HttpGet("my")]
    public async Task<IActionResult> GetMyReports()
    {
        var userId = GetCurrentUserId();
        var reports = await _reportService.GetByUserAsync(userId);
        return Ok(reports);
    }

    /// <summary>
    /// PATCH /api/reports/{id}/status
    /// Updates the status of a report and records the change in history.
    /// Intended for Company users to advance the report timeline.
    /// </summary>
    [Authorize(Roles = "Company")]
    [HttpPatch("{id:guid}/status")]
    public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] UpdateStatusRequest request)
    {
        try
        {
            var report = await _reportService.UpdateStatusAsync(id, request);
            return Ok(report);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    // ── Private Helpers ─────────────────────────────────────────

    /// <summary>
    /// Extracts the current user's ID from the JWT "sub" claim.
    /// </summary>
    private Guid GetCurrentUserId()
    {
        var sub = User.FindFirstValue(ClaimTypes.NameIdentifier)
                  ?? User.FindFirstValue("sub");

        if (string.IsNullOrEmpty(sub) || !Guid.TryParse(sub, out var userId))
            throw new UnauthorizedAccessException("Token inválido.");

        return userId;
    }
}
