import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { reportsApi } from '../../api/api';
import './MyReports.css';

/**
 * My Reports page — lists all reports created by the authenticated user.
 * Tapping a report opens a detail panel with the full status timeline.
 */
export default function MyReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const data = await reportsApi.getMyReports();
      setReports(data);
    } catch (err) {
      console.error('Failed to load reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadgeClass = (status) => {
    const map = {
      'Recebido': 'badge-received',
      'Em análise': 'badge-review',
      'Em andamento': 'badge-progress',
      'Concluído': 'badge-completed',
    };
    return map[status] || 'badge-received';
  };

  const getTimelineDotClass = (status) => {
    const map = {
      'Recebido': 'received',
      'Em análise': 'review',
      'Em andamento': 'progress',
      'Concluído': 'completed',
    };
    return map[status] || 'received';
  };

  // ── Loading State ─────────────────────────────────────
  if (loading) {
    return (
      <div className="page-container reports-page">
        <h1 className="page-title">Meus Relatórios</h1>
        <div className="report-loading">
          <div className="skeleton skeleton-card" />
          <div className="skeleton skeleton-card" />
          <div className="skeleton skeleton-card" />
        </div>
      </div>
    );
  }

  return (
    <div className="page-container reports-page">
      <h1 className="page-title">Meus Relatórios</h1>
      <p className="page-desc">
        {reports.length > 0
          ? `${reports.length} relatório${reports.length > 1 ? 's' : ''} encontrado${reports.length > 1 ? 's' : ''}`
          : 'Você ainda não tem relatórios'}
      </p>

      {/* ── Empty State ───────────────────────────────── */}
      {reports.length === 0 && (
        <div className="empty-state animate-fade-in-up">
          <div className="empty-state-icon">📋</div>
          <h2 className="empty-state-title">Nenhum relatório</h2>
          <p className="empty-state-text">
            Você ainda não reportou nenhum problema. Comece agora!
          </p>
          <button
            className="btn btn-primary btn-lg"
            onClick={() => navigate('/report')}
            style={{ marginTop: '1.5rem' }}
            id="btn-first-report"
          >
            Reportar Problema
          </button>
        </div>
      )}

      {/* ── Report List ───────────────────────────────── */}
      <div className="report-list stagger">
        {reports.map((report) => (
          <div
            key={report.id}
            className="glass-card report-card animate-fade-in-up"
            onClick={() => setSelectedReport(report)}
            role="button"
            tabIndex={0}
            aria-label={`Ver detalhes do protocolo ${report.protocolNumber}`}
          >
            <div className="report-card-header">
              <span className="report-protocol">{report.protocolNumber}</span>
              <span className={`badge ${getStatusBadgeClass(report.status)}`}>
                {report.status}
              </span>
            </div>
            <p className="report-card-desc">{report.description}</p>
            <div className="report-card-footer">
              <span className="report-card-date">
                📅 {formatDate(report.createdAt)}
              </span>
              {report.latitude && (
                <span className="report-card-date">📍 Com localização</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ── Detail Panel (Bottom Sheet) ───────────────── */}
      {selectedReport && (
        <div
          className="report-detail-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedReport(null);
          }}
        >
          <div className="report-detail-panel">
            <div className="detail-handle" />

            <div className="detail-header">
              <div>
                <div className="detail-protocol">{selectedReport.protocolNumber}</div>
                <span className={`badge ${getStatusBadgeClass(selectedReport.status)}`}>
                  {selectedReport.status}
                </span>
              </div>
              <button
                className="detail-close"
                onClick={() => setSelectedReport(null)}
                aria-label="Fechar detalhes"
                id="btn-close-detail"
              >
                ✕
              </button>
            </div>

            <div className="detail-desc">{selectedReport.description}</div>

            <div className="detail-meta">
              <span className="detail-meta-item">
                📅 {formatDate(selectedReport.createdAt)}
              </span>
              {selectedReport.latitude && (
                <span className="detail-meta-item">
                  📍 {selectedReport.latitude.toFixed(4)}, {selectedReport.longitude.toFixed(4)}
                </span>
              )}
            </div>

            {/* ── Status Timeline ──────────────────────── */}
            <div className="timeline-title">Histórico de Status</div>
            <div className="timeline stagger">
              {selectedReport.statusHistory?.map((entry, index) => (
                <div
                  key={entry.id}
                  className="timeline-item animate-fade-in-up"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <div className={`timeline-dot ${getTimelineDotClass(entry.status)}`} />
                  <div className="timeline-status">{entry.status}</div>
                  <div className="timeline-date">{formatDate(entry.changedAt)}</div>
                  {entry.notes && (
                    <div className="timeline-notes">"{entry.notes}"</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
