using System.ComponentModel.DataAnnotations;

namespace RPA.API.DTOs.Auth;

/// <summary>
/// Payload for user authentication.
/// </summary>
public class LoginRequest
{
    /// <summary>Registered email address.</summary>
    [Required(ErrorMessage = "E-mail é obrigatório.")]
    [EmailAddress(ErrorMessage = "E-mail inválido.")]
    public string Email { get; set; } = string.Empty;

    /// <summary>Plain-text password.</summary>
    [Required(ErrorMessage = "Senha é obrigatória.")]
    public string Password { get; set; } = string.Empty;
}
