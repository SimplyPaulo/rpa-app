import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import './Confirmation.css';

/**
 * Confirmation page shown after successfully submitting a report.
 * Displays the generated protocol number prominently.
 */
export default function Confirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const report = location.state?.report;

  // If no report data, redirect to the report form
  if (!report) {
    return <Navigate to="/report" replace />;
  }

  const formattedDate = new Date(report.createdAt).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="page-container confirmation-page">
      <div className="confirmation-content">
        {/* ── Success Icon ──────────────────────────────── */}
        <div className="confirmation-icon">✅</div>

        <h1 className="confirmation-title">Relatório Enviado!</h1>
        <p className="confirmation-desc">
          Seu problema foi registrado com sucesso. Use o número de protocolo abaixo para acompanhar o andamento.
        </p>

        {/* ── Protocol Card ─────────────────────────────── */}
        <div className="glass-card protocol-card">
          <div className="protocol-label">Número de Protocolo</div>
          <div className="protocol-number" id="protocol-number">
            {report.protocolNumber}
          </div>
          <div className="protocol-date">
            Registrado em {formattedDate}
          </div>
        </div>

        {/* ── Actions ───────────────────────────────────── */}
        <div className="confirmation-actions">
          <button
            className="btn btn-primary btn-full btn-lg"
            onClick={() => navigate('/my-reports')}
            id="btn-view-reports"
          >
            📂 Ver Meus Relatórios
          </button>
          <button
            className="btn btn-secondary btn-full"
            onClick={() => navigate('/report')}
            id="btn-new-report"
          >
            ➕ Reportar Outro Problema
          </button>
        </div>
      </div>
    </div>
  );
}
