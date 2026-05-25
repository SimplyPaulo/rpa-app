namespace RPA.API.Enums;

/// <summary>
/// Defines the access role for a user in the system.
/// </summary>
public enum UserRole
{
    /// <summary>
    /// End-user who reports accessibility problems.
    /// </summary>
    Client = 0,

    /// <summary>
    /// Company/maintenance team that handles reports.
    /// </summary>
    Company = 1
}
