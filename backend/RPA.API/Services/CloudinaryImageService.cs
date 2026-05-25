using CloudinaryDotNet;
using CloudinaryDotNet.Actions;

namespace RPA.API.Services;

/// <summary>
/// Uploads images to Cloudinary and returns the public URL.
/// Free tier: 25 credits/month, no credit card required, no expiration.
/// </summary>
public class CloudinaryImageService : IImageService
{
    private readonly Cloudinary _cloudinary;

    public CloudinaryImageService(IConfiguration config)
    {
        var account = new Account(
            config["Cloudinary:CloudName"],
            config["Cloudinary:ApiKey"],
            config["Cloudinary:ApiSecret"]
        );
        _cloudinary = new Cloudinary(account);
        _cloudinary.Api.Secure = true;
    }

    /// <inheritdoc />
    public async Task<string?> UploadAsync(IFormFile? file)
    {
        if (file == null || file.Length == 0)
            return null;

        using var stream = file.OpenReadStream();

        var uploadParams = new ImageUploadParams
        {
            File = new FileDescription(file.FileName, stream),
            Folder = "rpa/reports",
            PublicId = Guid.NewGuid().ToString(),
            Overwrite = false,
            // Auto-optimize: reduces ~5MB phone photo to ~200KB without visible quality loss
            Transformation = new Transformation()
                .Quality("auto")
                .FetchFormat("auto")
        };

        var result = await _cloudinary.UploadAsync(uploadParams);

        if (result.Error != null)
            throw new Exception($"Cloudinary upload failed: {result.Error.Message}");

        return result.SecureUrl?.ToString();
    }
}
