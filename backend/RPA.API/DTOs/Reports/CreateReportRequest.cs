using System.ComponentModel.DataAnnotations;

namespace RPA.API.DTOs.Reports;

/// <summary>
/// Payload for submitting a new accessibility problem report via multipart/form-data.
/// Accepts the actual image file instead of a URL string.
/// </summary>
public class CreateReportRequest
{
    /// <summary>Description of the problem (max 500 characters).</summary>
    [Required(ErrorMessage = "Descrição é obrigatória.")]
    [MaxLength(500, ErrorMessage = "Descrição deve ter no máximo 500 caracteres.")]
    public string Description { get; set; } = string.Empty;

    /// <summary>GPS latitude from the browser's Geolocation API. Optional.</summary>
    public double? Latitude { get; set; }

    /// <summary>GPS longitude from the browser's Geolocation API. Optional.</summary>
    public double? Longitude { get; set; }

    /// <summary>
    /// Image file uploaded by the user (photo of the accessibility issue).
    /// Optional — the user may submit a report without a photo.
    /// In the MVP, the backend simulates a storage URL.
    /// In production, this file will be uploaded to Supabase Storage / Cloudinary.
    /// </summary>
    public IFormFile? Image { get; set; }
}
