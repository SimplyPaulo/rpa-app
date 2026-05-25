import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Layout.css';

/**
 * Main app layout with sticky header and bottom tab navigation.
 * Navigation items change based on the user's role:
 *   - Client: Reportar | Meus Relatórios
 *   - Company: Painel | Meus Relatórios
 */
export default function Layout() {
  const { user, isCompany, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const roleLabel = isCompany ? 'Empresa' : 'Cliente';

  return (
    <>
      {/* ── Top Header ────────────────────────────────────── */}
      <header className="layout-header">
        <div className="header-brand">
          <span className="header-logo">RPA</span>
        </div>
        <div className="header-user">
          <div>
            <div className="header-username">{user?.fullName}</div>
            <div className="header-role">{roleLabel}</div>
          </div>
          <button className="btn-logout" onClick={handleLogout} id="btn-logout">
            Sair
          </button>
        </div>
      </header>

      {/* ── Page Content ──────────────────────────────────── */}
      <main className="layout-main">
        <Outlet />
      </main>

      {/* ── Bottom Navigation ─────────────────────────────── */}
      <nav className="layout-nav" aria-label="Navegação principal">
        <ul className="nav-list">
          {isCompany ? (
            /* ── Company Navigation ──────────────────────── */
            <>
              <li className="nav-item">
                <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} id="nav-dashboard">
                  <span className="nav-icon">🏢</span>
                  <span className="nav-label">Painel</span>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/my-reports" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} id="nav-my-reports">
                  <span className="nav-icon">📂</span>
                  <span className="nav-label">Meus Relatórios</span>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/qrcode" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} id="nav-qrcode-company">
                  <span className="nav-icon">📱</span>
                  <span className="nav-label">QR Code</span>
                </NavLink>
              </li>
            </>
          ) : (
            /* ── Client Navigation ───────────────────────── */
            <>
              <li className="nav-item">
                <NavLink to="/report" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} id="nav-report">
                  <span className="nav-icon">📋</span>
                  <span className="nav-label">Reportar</span>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/my-reports" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} id="nav-my-reports">
                  <span className="nav-icon">📂</span>
                  <span className="nav-label">Meus Relatórios</span>
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </nav>
    </>
  );
}
