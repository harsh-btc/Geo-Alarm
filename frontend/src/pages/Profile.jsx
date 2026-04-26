import { useState } from 'react';
import { User, Mail, Bell, Calendar, Edit2, Save, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../api/auth';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name.trim() || name.trim().length < 2) return toast.error('Name must be at least 2 characters');
    setLoading(true);
    try {
      await updateProfile({ name: name.trim() });
      await refreshUser();
      setEditing(false);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const avatarLetter = (user?.name || 'U').charAt(0).toUpperCase();
  const joinDate = user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '—';

  return (
    <div style={{ minHeight: '100vh', paddingTop: '64px', padding: '100px 24px 60px' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: '32px',
          fontWeight: 800, letterSpacing: '-1px', marginBottom: '32px',
        }}>
          Profile
        </h1>

        {/* Avatar & name card */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)', padding: '32px',
          marginBottom: '20px',
          animation: 'fadeIn 0.4s ease',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '28px' }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-display)', fontWeight: 800,
              fontSize: '28px', color: 'white',
              boxShadow: '0 0 20px rgba(0,212,255,0.3)',
              flexShrink: 0,
            }}>
              {avatarLetter}
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '22px' }}>
                {user?.name}
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>{user?.email}</div>
            </div>
            {!editing && (
              <button
                onClick={() => { setEditing(true); setName(user?.name || ''); }}
                style={{
                  marginLeft: 'auto',
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '8px 14px', borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-glass)', border: '1px solid var(--border)',
                  color: 'var(--text-secondary)', fontSize: '13px', cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-bright)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
              >
                <Edit2 size={13} /> Edit
              </button>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Name field */}
            <ProfileRow icon={<User size={15} />} label="Full Name">
              {editing ? (
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoFocus
                  style={{
                    background: 'var(--bg-glass)', border: '1px solid var(--accent)',
                    borderRadius: 'var(--radius-sm)', padding: '6px 10px',
                    color: 'var(--text-primary)', fontSize: '14px', outline: 'none',
                    boxShadow: '0 0 0 3px var(--accent-dim)',
                    width: '200px',
                  }}
                />
              ) : (
                <span style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: 500 }}>{user?.name}</span>
              )}
            </ProfileRow>

            <ProfileRow icon={<Mail size={15} />} label="Email">
              <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{user?.email}</span>
            </ProfileRow>

            <ProfileRow icon={<Calendar size={15} />} label="Member Since">
              <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{joinDate}</span>
            </ProfileRow>
          </div>

          {editing && (
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setEditing(false)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '8px 16px', borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-glass)', border: '1px solid var(--border)',
                  color: 'var(--text-secondary)', fontSize: '13px', cursor: 'pointer',
                }}
              >
                <X size={13} /> Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '8px 16px', borderRadius: 'var(--radius-md)',
                  background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
                  color: 'white', fontSize: '13px', fontWeight: 600,
                  border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? <div className="spinner" style={{ width: 12, height: 12, borderTopColor: 'white' }} /> : <Save size={13} />}
                Save
              </button>
            </div>
          )}
        </div>

        {/* Stats card */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)', padding: '28px',
          animation: 'fadeIn 0.4s ease 0.1s both',
        }}>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontWeight: 700,
            fontSize: '16px', marginBottom: '20px',
            display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            <Bell size={16} color="var(--accent)" /> Your Stats
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
            <StatBox label="Total Alarms Triggered" value={user?.alarmsTriggered || 0} icon="⚡" color="var(--warning)" />
            <StatBox label="Account Status" value="Active" icon="✅" color="var(--success)" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileRow({ icon, label, children }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      padding: '12px 16px',
      background: 'var(--bg-glass)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-md)',
      gap: '12px',
    }}>
      <span style={{ color: 'var(--accent)', flexShrink: 0 }}>{icon}</span>
      <span style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', minWidth: '80px' }}>
        {label}
      </span>
      <div style={{ marginLeft: 'auto' }}>{children}</div>
    </div>
  );
}

function StatBox({ label, value, icon, color }) {
  return (
    <div style={{
      padding: '18px',
      background: 'var(--bg-glass)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: '24px', marginBottom: '8px' }}>{icon}</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 800, color }}>{value}</div>
      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        {label}
      </div>
    </div>
  );
}
