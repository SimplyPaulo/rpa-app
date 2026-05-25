using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace RPA.API.Data;

/// <summary>
/// Design-time factory used by EF Core CLI tools (dotnet ef migrations).
/// Provides a PostgreSQL-configured DbContext for generating migrations,
/// even though the Development runtime uses InMemory.
/// </summary>
public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
{
    public AppDbContext CreateDbContext(string[] args)
    {
        var builder = new DbContextOptionsBuilder<AppDbContext>();

        // Use a dummy connection string — migrations only generate SQL,
        // they don't actually connect to a database at this stage.
        builder.UseNpgsql("Host=localhost;Database=rpa_design;Username=postgres;Password=dummy");

        return new AppDbContext(builder.Options);
    }
}
