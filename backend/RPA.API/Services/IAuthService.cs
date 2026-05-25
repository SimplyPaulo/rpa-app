using RPA.API.DTOs.Auth;

namespace RPA.API.Services;

/// <summary>
/// Contract for authentication operations (register, login, token generation).
/// </summary>
public interface IAuthService
{
    /// <summary>Register a new user and return a JWT token.</summary>
    Task<AuthResponse> RegisterAsync(RegisterRequest request);

    /// <summary>Authenticate a user and return a JWT token.</summary>
    Task<AuthResponse> LoginAsync(LoginRequest request);
}
