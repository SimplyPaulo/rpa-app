using System.ComponentModel.DataAnnotations;

namespace RPA.API.DTOs.Auth;

/// <summary>
/// Payload for creating a new user account.
/// </summary>
public class RegisterRequest
{
    /// <summary>Full name of the user.</summary>
    [Required(ErrorMessage = "Nome completo é obrigatório.")]
    [MaxLength(150, ErrorMessage = "Nome completo deve ter no máximo 150 caracteres.")]
    public string FullName { get; set; } = string.Empty;

    /// <summary>Email address (must be unique).</summary>
    [Required(ErrorMessage = "E-mail é obrigatório.")]
    [EmailAddress(ErrorMessage = "E-mail inválido.")]
    [MaxLength(100, ErrorMessage = "E-mail deve ter no máximo 100 caracteres.")]
    public string Email { get; set; } = string.Empty;

    /// <summary>Plain-text password (will be hashed with BCrypt).</summary>
    [Required(ErrorMessage = "Senha é obrigatória.")]
    [MinLength(6, ErrorMessage = "Senha deve ter no mínimo 6 caracteres.")]
    public string Password { get; set; } = string.Empty;

    /// <summary>Phone number (numeric only).</summary>
    [Required(ErrorMessage = "Telefone é obrigatório.")]
    public long Phone { get; set; }

    /// <summary>Access role: 0 = Client, 1 = Company.</summary>
    [Required(ErrorMessage = "Perfil é obrigatório.")]
    [Range(0, 1, ErrorMessage = "Perfil deve ser 0 (Cliente) ou 1 (Empresa).")]
    public int Role { get; set; }
}
