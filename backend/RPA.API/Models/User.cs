using System.ComponentModel.DataAnnotations;
using RPA.API.Enums;

namespace RPA.API.Models;

/// <summary>
/// Represents a platform user — either a Client who reports problems
/// or a Company that manages and resolves them.
/// </summary>
public class User
{
    /// <summary>Primary key, auto-generated GUID.</summary>
    public Guid Id { get; set; }

    /// <summary>Full name of the user (max 150 characters).</summary>
    [Required]
    [MaxLength(150)]
    public string FullName { get; set; } = string.Empty;

    /// <summary>Unique email address (max 100 characters).</summary>
    [Required]
    [MaxLength(100)]
    public string Email { get; set; } = string.Empty;

    /// <summary>BCrypt-hashed password.</summary>
    [Required]
    public string PasswordHash { get; set; } = string.Empty;

    /// <summary>Access role: Client or Company.</summary>
    [Required]
    public UserRole Role { get; set; }

    /// <summary>Phone number stored as a numeric value.</summary>
    [Required]
    public long Phone { get; set; }

    /// <summary>UTC timestamp of account creation.</summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // ── Navigation ──────────────────────────────────────────────
    /// <summary>Reports submitted by this user.</summary>
    public ICollection<Report> Reports { get; set; } = new List<Report>();
}
