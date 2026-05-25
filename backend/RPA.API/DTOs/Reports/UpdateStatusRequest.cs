using System.ComponentModel.DataAnnotations;

namespace RPA.API.DTOs.Reports;

/// <summary>
/// Payload for updating the status of an existing report.
/// Typically used by Company users to advance the report through the timeline.
/// </summary>
public class UpdateStatusRequest
{
    /// <summary>
    /// New status value: 0 = Recebido, 1 = Em análise, 2 = Em andamento, 3 = Concluído.
    /// </summary>
    [Required(ErrorMessage = "Novo status é obrigatório.")]
    [Range(0, 3, ErrorMessage = "Status deve ser entre 0 e 3.")]
    public int Status { get; set; }

    /// <summary>Optional observation about this status change (max 500 characters).</summary>
    [MaxLength(500, ErrorMessage = "Observações devem ter no máximo 500 caracteres.")]
    public string? Notes { get; set; }
}
