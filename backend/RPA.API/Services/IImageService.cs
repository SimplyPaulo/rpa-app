namespace RPA.API.Services;

/// <summary>
/// Contract for uploading image files and returning a public URL.
/// </summary>
public interface IImageService
{
    /// <summary>
    /// Uploads the given file and returns the publicly accessible URL.
    /// Returns null if the file is null or empty.
    /// </summary>
    Task<string?> UploadAsync(IFormFile? file);
}
