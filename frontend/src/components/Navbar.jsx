import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { MapPin, Bell, LogOut, Sun, Moon, Menu, X, User, BarChart2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      background: 'rgba(8, 12, 20, 0.85)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border)',
    }}>
      <div style={{
        maxWidth: '1200px', margin: '0 auto',
        padding: '0 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: '64px',
      }}>
        {/* Logo */}
        <Link to={user ? '/dashboard' : '/'} style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          fontFamily: 'var(--font-display)',
          fontWeight: 800, fontSize: '20px', letterSpacing: '-0.5px',
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: '10px',
            background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <MapPin size={16} color="white" />
          </div>
          <span className="text-gradient">GeoAlarm</span>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} className="desktop-nav">
          {user ? (
            <>
              <NavLink to="/dashboard" active={isActive('/dashboard')}>
                <Bell size={15} /> Dashboard
              </NavLink>
              <NavLink to="/profile" active={isActive('/profile')}>
                <User size={15} /> Profile
              </NavLink>
              <NavLink to="/history" active={isActive('/history')}>
                <BarChart2 size={15} /> History
              </NavLink>
              <button
                onClick={toggleTheme}
                style={{ ...iconBtn }}
                title="Toggle theme"
              >
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              </button>
              <button
                onClick={handleLogout}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '8px 16px', borderRadius: 'var(--radius-md)',
                  background: 'var(--danger-dim)',
                  color: 'var(--danger)',
                  border: '1px solid rgba(239,68,68,0.2)',
                  fontSize: '13px', fontWeight: 500,
                  transition: 'all var(--transition-base)',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.25)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--danger-dim)'}
              >
                <LogOut size={14} /> Logout
              </button>
            </>
          ) : (
            <>
              <button onClick={toggleTheme} style={iconBtn} title="Toggle theme">
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              </button>
              <Link to="/login" style={{
                padding: '8px 16px', borderRadius: 'var(--radius-md)',
                color: 'var(--text-secondary)',
                fontSize: '13px', fontWeight: 500,
                transition: 'color var(--transition-fast)',
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
              >Log in</Link>
              <Link to="/signup" style={{
                padding: '8px 18px', borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
                color: 'white',
                fontSize: '13px', fontWeight: 600,
                transition: 'opacity var(--transition-fast)',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >Get Started</Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen((o) => !o)}
          style={{ ...iconBtn, display: 'none' }}
          className="mobile-menu-btn"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          background: 'var(--bg-secondary)',
          borderTop: '1px solid var(--border)',
          padding: '16px 24px',
          display: 'flex', flexDirection: 'column', gap: '8px',
        }}>
          {user ? (
            <>
              <MobileLink to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</MobileLink>
              <MobileLink to="/profile" onClick={() => setMenuOpen(false)}>Profile</MobileLink>
              <MobileLink to="/history" onClick={() => setMenuOpen(false)}>History</MobileLink>
              <button onClick={handleLogout} style={{ ...mobileBtn, color: 'var(--danger)' }}>Logout</button>
            </>
          ) : (
            <>
              <MobileLink to="/login" onClick={() => setMenuOpen(false)}>Log in</MobileLink>
              <MobileLink to="/signup" onClick={() => setMenuOpen(false)}>Get Started</MobileLink>
            </>
          )}
          <button onClick={toggleTheme} style={{ ...mobileBtn }}>
            {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}

const iconBtn = {
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  width: 36, height: 36, borderRadius: 'var(--radius-md)',
  background: 'var(--bg-glass)', border: '1px solid var(--border)',
  color: 'var(--text-secondary)', cursor: 'pointer',
  transition: 'all var(--transition-fast)',
};

function NavLink({ to, active, children }) {
  return (
    <Link to={to} style={{
      display: 'flex', alignItems: 'center', gap: '6px',
      padding: '7px 14px', borderRadius: 'var(--radius-md)',
      background: active ? 'var(--accent-dim)' : 'transparent',
      border: active ? '1px solid var(--border-accent)' : '1px solid transparent',
      color: active ? 'var(--accent)' : 'var(--text-secondary)',
      fontSize: '13px', fontWeight: 500,
      transition: 'all var(--transition-fast)',
    }}>
      {children}
    </Link>
  );
}

function MobileLink({ to, children, onClick }) {
  return (
    <Link to={to} onClick={onClick} style={{
      padding: '12px 16px', borderRadius: 'var(--radius-md)',
      background: 'var(--bg-glass)', border: '1px solid var(--border)',
      color: 'var(--text-primary)', fontSize: '14px', fontWeight: 500,
      display: 'block',
    }}>{children}</Link>
  );
}

const mobileBtn = {
  padding: '12px 16px', borderRadius: 'var(--radius-md)',
  background: 'var(--bg-glass)', border: '1px solid var(--border)',
  color: 'var(--text-primary)', fontSize: '14px', fontWeight: 500,
  textAlign: 'left', width: '100%', cursor: 'pointer',
};
