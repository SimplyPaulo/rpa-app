namespace RPA.API.DTOs.Auth;

/// <summary>
/// Response returned after a successful login or registration.
/// </summary>
public class AuthResponse
{
    /// <summary>JWT access token.</summary>
    public string Token { get; set; } = string.Empty;

    /// <summary>Token expiration date/time (UTC).</summary>
    public DateTime ExpiresAt { get; set; }

    /// <summary>User ID.</summary>
    public Guid UserId { get; set; }

    /// <summary>User's full name.</summary>
    public string FullName { get; set; } = string.Empty;

    /// <summary>User's email.</summary>
    public string Email { get; set; } = string.Empty;

    /// <summary>User's role (Client or Company).</summary>
    public string Role { get; set; } = string.Empty;
}
