import { useState, useEffect } from 'react';
import { reportsApi } from '../../api/api';
import './CompanyDashboard.css';

/**
 * Company Dashboard — shows ALL reports from all clients.
 * Company users can view details and update the status of each report.
 */
export default function CompanyDashboard() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [toast, setToast] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const data = await reportsApi.getAllReports();
      setReports(data);
    } catch (err) {
      console.error('Failed to load reports:', err);
    } finally {
      setLoading(false);
    }
  };

  // ── Status update ─────────────────────────────────────
  const handleStatusUpdate = async (reportId, statusValue, statusLabel) => {
    setUpdatingId(reportId);
    try {
      const updated = await reportsApi.updateStatus(reportId, {
        status: statusValue,
        notes: `Status alterado para: ${statusLabel}`,
      });

      // Update the report in the local list
      setReports((prev) =>
        prev.map((r) => (r.id === reportId ? updated : r))
      );

      setToast(`✅ Status atualizado para "${statusLabel}"`);
      setTimeout(() => setToast(''), 3000);
    } catch (err) {
      setToast(`❌ Erro: ${err.message}`);
      setTimeout(() => setToast(''), 4000);
    } finally {
      setUpdatingId(null);
    }
  };

  // ── Helpers ───────────────────────────────────────────
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

  const statusOptions = [
    { value: 0, label: 'Recebido', css: 's-received' },
    { value: 1, label: 'Em análise', css: 's-review' },
    { value: 2, label: 'Em andamento', css: 's-progress' },
    { value: 3, label: 'Concluído', css: 's-completed' },
  ];

  // ── Filtering ─────────────────────────────────────────
  const filteredReports = filter === 'all'
    ? reports
    : reports.filter((r) => r.status === filter);

  const counts = {
    received: reports.filter((r) => r.status === 'Recebido').length,
    review: reports.filter((r) => r.status === 'Em análise').length,
    progress: reports.filter((r) => r.status === 'Em andamento').length,
    completed: reports.filter((r) => r.status === 'Concluído').length,
  };

  // ── Loading ───────────────────────────────────────────
  if (loading) {
    return (
      <div className="page-container dashboard-page">
        <h1 className="page-title">Painel da Empresa</h1>
        <div className="report-loading">
          <div className="skeleton skeleton-card" />
          <div className="skeleton skeleton-card" />
          <div className="skeleton skeleton-card" />
        </div>
      </div>
    );
  }

  return (
    <div className="page-container dashboard-page">
      <h1 className="page-title">Painel da Empresa</h1>
      <p className="page-desc">
        Gerencie os relatórios de acessibilidade dos clientes.
      </p>

      {/* ── Stats ──────────────────────────────────────── */}
      <div className="dashboard-stats animate-fade-in-up">
        <div className="stat-card">
          <div className="stat-number received">{counts.received}</div>
          <div className="stat-label">Recebidos</div>
        </div>
        <div className="stat-card">
          <div className="stat-number review">{counts.review}</div>
          <div className="stat-label">Em análise</div>
        </div>
        <div className="stat-card">
          <div className="stat-number progress">{counts.progress}</div>
          <div className="stat-label">Andamento</div>
        </div>
        <div className="stat-card">
          <div className="stat-number completed">{counts.completed}</div>
          <div className="stat-label">Concluídos</div>
        </div>
      </div>

      {/* ── Filters ────────────────────────────────────── */}
      <div className="dashboard-filters">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          Todos ({reports.length})
        </button>
        <button
          className={`filter-btn ${filter === 'Recebido' ? 'active' : ''}`}
          onClick={() => setFilter('Recebido')}
        >
          Recebidos ({counts.received})
        </button>
        <button
          className={`filter-btn ${filter === 'Em análise' ? 'active' : ''}`}
          onClick={() => setFilter('Em análise')}
        >
          Em análise ({counts.review})
        </button>
        <button
          className={`filter-btn ${filter === 'Em andamento' ? 'active' : ''}`}
          onClick={() => setFilter('Em andamento')}
        >
          Andamento ({counts.progress})
        </button>
        <button
          className={`filter-btn ${filter === 'Concluído' ? 'active' : ''}`}
          onClick={() => setFilter('Concluído')}
        >
          Concluídos ({counts.completed})
        </button>
      </div>

      {/* ── Empty state ────────────────────────────────── */}
      {filteredReports.length === 0 && (
        <div className="empty-state animate-fade-in-up">
          <div className="empty-state-icon">📭</div>
          <h2 className="empty-state-title">Nenhum relatório</h2>
          <p className="empty-state-text">
            {filter === 'all'
              ? 'Ainda não há relatórios de clientes.'
              : `Nenhum relatório com status "${filter}".`}
          </p>
        </div>
      )}

      {/* ── Report cards ───────────────────────────────── */}
      <div className="stagger">
        {filteredReports.map((report) => (
          <div key={report.id} className="glass-card mgmt-card animate-fade-in-up">
            <div className="mgmt-card-header">
              <div>
                <div className="mgmt-protocol">{report.protocolNumber}</div>
                <div className="mgmt-user">👤 {report.userName}</div>
              </div>
              <span className={`badge ${getStatusBadgeClass(report.status)}`}>
                {report.status}
              </span>
            </div>

            <p className="mgmt-desc">{report.description}</p>

            <div className="mgmt-meta">
              <span className="mgmt-meta-item">📅 {formatDate(report.createdAt)}</span>
              {report.latitude && (
                <span className="mgmt-meta-item">
                  📍 {report.latitude.toFixed(4)}, {report.longitude.toFixed(4)}
                </span>
              )}
            </div>

            {/* ── Status update buttons ─────────────────── */}
            <div className="status-controls">
              <span className="status-controls-label">Alterar status:</span>
              <div className="status-buttons">
                {statusOptions.map((opt) => {
                  const isCurrent = report.status === opt.label;
                  return (
                    <button
                      key={opt.value}
                      className={`status-btn ${opt.css} ${isCurrent ? 'current' : ''}`}
                      disabled={isCurrent || updatingId === report.id}
                      onClick={() => handleStatusUpdate(report.id, opt.value, opt.label)}
                    >
                      {updatingId === report.id ? '...' : opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Toast notification ─────────────────────────── */}
      {toast && <div className="update-toast">{toast}</div>}
    </div>
  );
}
