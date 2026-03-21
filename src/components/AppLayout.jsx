import { NavLink } from "react-router-dom";

const navClass = ({ isActive }) => `nav-link${isActive ? " active" : ""}`;

export function AppLayout({ children }) {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <div className="brand">Astra Metrics Console</div>
          <small>Professional analytics workspace</small>
        </div>
        <nav className="nav-links" aria-label="Main navigation">
          <NavLink to="/dashboard" className={navClass}>
            Dashboard
          </NavLink>
          <NavLink to="/data" className={navClass}>
            Data
          </NavLink>
          <NavLink to="/settings" className={navClass}>
            Settings
          </NavLink>
        </nav>
      </header>
      {children}
    </div>
  );
}
