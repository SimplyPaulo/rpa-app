using Microsoft.EntityFrameworkCore;
using RPA.API.Models;

namespace RPA.API.Data;

/// <summary>
/// Entity Framework Core database context for the RPA application.
/// Maps C# models (English naming) to PostgreSQL tables/columns (Portuguese naming).
/// </summary>
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Report> Reports => Set<Report>();
    public DbSet<ReportStatusHistory> ReportStatusHistories => Set<ReportStatusHistory>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // ══════════════════════════════════════════════════════════
        //  User → "usuarios"
        // ══════════════════════════════════════════════════════════
        modelBuilder.Entity<User>(entity =>
        {
            entity.ToTable("usuarios");

            entity.HasKey(u => u.Id);

            entity.Property(u => u.Id)
                  .HasColumnName("id")
                  .HasDefaultValueSql("gen_random_uuid()");

            entity.Property(u => u.FullName)
                  .HasColumnName("nome_completo")
                  .HasMaxLength(150)
                  .IsRequired();

            entity.Property(u => u.Email)
                  .HasColumnName("email")
                  .HasMaxLength(100)
                  .IsRequired();

            entity.Property(u => u.PasswordHash)
                  .HasColumnName("hash_senha")
                  .IsRequired();

            entity.Property(u => u.Role)
                  .HasColumnName("perfil")
                  .IsRequired();

            entity.Property(u => u.Phone)
                  .HasColumnName("telefone")
                  .IsRequired();

            entity.Property(u => u.CreatedAt)
                  .HasColumnName("criado_em")
                  .HasDefaultValueSql("NOW()");

            // Unique index on email
            entity.HasIndex(u => u.Email)
                  .IsUnique();
        });

        // ══════════════════════════════════════════════════════════
        //  Report → "relatorios"
        // ══════════════════════════════════════════════════════════
        modelBuilder.Entity<Report>(entity =>
        {
            entity.ToTable("relatorios");

            entity.HasKey(r => r.Id);

            entity.Property(r => r.Id)
                  .HasColumnName("id")
                  .HasDefaultValueSql("gen_random_uuid()");

            entity.Property(r => r.ProtocolNumber)
                  .HasColumnName("numero_protocolo")
                  .HasMaxLength(20)
                  .IsRequired();

            entity.Property(r => r.Description)
                  .HasColumnName("descricao")
                  .HasMaxLength(500)
                  .IsRequired();

            entity.Property(r => r.ImageUrl)
                  .HasColumnName("url_imagem")
                  .HasMaxLength(500);

            entity.Property(r => r.Latitude)
                  .HasColumnName("latitude");

            entity.Property(r => r.Longitude)
                  .HasColumnName("longitude");

            entity.Property(r => r.Status)
                  .HasColumnName("status")
                  .IsRequired();

            entity.Property(r => r.CreatedAt)
                  .HasColumnName("criado_em")
                  .HasDefaultValueSql("NOW()");

            entity.Property(r => r.UpdatedAt)
                  .HasColumnName("atualizado_em")
                  .HasDefaultValueSql("NOW()");

            entity.Property(r => r.UserId)
                  .HasColumnName("usuario_id")
                  .IsRequired();

            // Unique index on protocol number
            entity.HasIndex(r => r.ProtocolNumber)
                  .IsUnique();

            // Index on user FK for fast lookups
            entity.HasIndex(r => r.UserId);

            // Relationship: Report → User
            entity.HasOne(r => r.User)
                  .WithMany(u => u.Reports)
                  .HasForeignKey(r => r.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // ══════════════════════════════════════════════════════════
        //  ReportStatusHistory → "historico_status_relatorio"
        // ══════════════════════════════════════════════════════════
        modelBuilder.Entity<ReportStatusHistory>(entity =>
        {
            entity.ToTable("historico_status_relatorio");

            entity.HasKey(h => h.Id);

            entity.Property(h => h.Id)
                  .HasColumnName("id")
                  .HasDefaultValueSql("gen_random_uuid()");

            entity.Property(h => h.ReportId)
                  .HasColumnName("relatorio_id")
                  .IsRequired();

            entity.Property(h => h.Status)
                  .HasColumnName("status")
                  .IsRequired();

            entity.Property(h => h.ChangedAt)
                  .HasColumnName("alterado_em")
                  .HasDefaultValueSql("NOW()");

            entity.Property(h => h.Notes)
                  .HasColumnName("observacoes")
                  .HasMaxLength(500);

            // Index on report FK for fast timeline queries
            entity.HasIndex(h => h.ReportId);

            // Relationship: StatusHistory → Report
            entity.HasOne(h => h.Report)
                  .WithMany(r => r.StatusHistory)
                  .HasForeignKey(h => h.ReportId)
                  .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
