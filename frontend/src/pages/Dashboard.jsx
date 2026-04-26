import { useState, useEffect, useCallback } from 'react';
import { Plus, Navigation, NavigationOff, MapPin, Bell, BellOff, Loader, RefreshCw } from 'lucide-react';
import { getAlarms, createAlarm, updateAlarm, deleteAlarm } from '../api/alarms';
import { useAuth } from '../context/AuthContext';
import { useGeolocation } from '../hooks/useGeolocation';
import { useAlarmTrigger } from '../hooks/useAlarmTrigger';
import AlarmCard from '../components/AlarmCard';
import AddAlarmModal from '../components/AddAlarmModal';
import TrackingMap from '../components/TrackingMap';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { user, refreshUser } = useAuth();
  const [alarms, setAlarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [firedAlarm, setFiredAlarm] = useState(null);

  const { position, error: geoError, watching, startWatching, stopWatching } = useGeolocation();

  const handleAlarmFire = useCallback((alarm) => {
    setFiredAlarm(alarm);
    refreshUser();
    setTimeout(() => setFiredAlarm(null), 10000);
  }, [refreshUser]);

  useAlarmTrigger({ alarms, position, onAlarmFire: handleAlarmFire });

  const fetchAlarms = useCallback(async () => {
    try {
      const { data } = await getAlarms();
      setAlarms(data.alarms);
    } catch {
      toast.error('Failed to load alarms');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAlarms(); }, [fetchAlarms]);

  const handleCreate = async (formData) => {
    const { data } = await createAlarm(formData);
    setAlarms((prev) => [data.alarm, ...prev]);
    toast.success('Alarm created! 📍');
  };

  const handleDelete = async (id) => {
    await deleteAlarm(id);
    setAlarms((prev) => prev.filter((a) => a._id !== id));
    toast.success('Alarm deleted');
  };

  const handleToggle = async (id, isActive) => {
    const { data } = await updateAlarm(id, { isActive });
    setAlarms((prev) => prev.map((a) => (a._id === id ? data.alarm : a)));
    toast.success(isActive ? 'Alarm activated ✅' : 'Alarm deactivated');
  };

  const activeCount = alarms.filter((a) => a.isActive).length;

  return (
    <div style={{ minHeight: '100vh', paddingTop: '64px' }}>
      {/* Alarm fired overlay */}
      {firedAlarm && (
        <div style={{
          position: 'fixed', top: '80px', left: '50%', transform: 'translateX(-50%)',
          zIndex: 1500,
          background: 'linear-gradient(135deg, rgba(16,217,138,0.95), rgba(8,12,20,0.95))',
          border: '1px solid var(--success)',
          borderRadius: 'var(--radius-xl)',
          padding: '16px 24px',
          boxShadow: '0 0 40px rgba(16,217,138,0.4)',
          display: 'flex', alignItems: 'center', gap: '14px',
          animation: 'scaleIn 0.3s ease',
          maxWidth: '360px', width: '90vw',
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: '50%',
            background: 'rgba(255,255,255,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '24px', flexShrink: 0,
          }}>🔔</div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '16px', color: 'white' }}>
              You've arrived!
            </div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)' }}>
              {firedAlarm.locationName}
            </div>
          </div>
          <button onClick={() => setFiredAlarm(null)} style={{
            marginLeft: 'auto', background: 'rgba(255,255,255,0.15)',
            border: 'none', color: 'white', borderRadius: '8px',
            padding: '4px 8px', cursor: 'pointer', fontSize: '12px',
          }}>✕</button>
        </div>
      )}

      <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
          marginBottom: '32px', gap: '16px', flexWrap: 'wrap',
        }}>
          <div>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(24px, 4vw, 36px)',
              fontWeight: 800, letterSpacing: '-1px',
            }}>
              Hey, {user?.name?.split(' ')[0]} 👋
            </h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: '4px', fontSize: '14px' }}>
              {activeCount > 0
                ? `${activeCount} active alarm${activeCount > 1 ? 's' : ''} watching`
                : 'No active alarms — create one to get started'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {/* GPS toggle */}
            <button
              onClick={watching ? stopWatching : startWatching}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '10px 18px', borderRadius: 'var(--radius-md)',
                background: watching ? 'var(--success-dim)' : 'var(--bg-glass)',
                border: `1px solid ${watching ? 'rgba(16,217,138,0.3)' : 'var(--border)'}`,
                color: watching ? 'var(--success)' : 'var(--text-secondary)',
                fontSize: '13px', fontWeight: 500, cursor: 'pointer',
                transition: 'all var(--transition-base)',
              }}
            >
              {watching ? <Navigation size={15} /> : <NavigationOff size={15} />}
              {watching ? 'Tracking On' : 'Start Tracking'}
            </button>

            <button
              onClick={() => setShowModal(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '10px 18px', borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
                color: 'white', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                border: 'none', boxShadow: '0 4px 15px rgba(0,212,255,0.2)',
                transition: 'all var(--transition-base)',
              }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 25px rgba(0,212,255,0.4)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,212,255,0.2)'}
            >
              <Plus size={15} /> New Alarm
            </button>
          </div>
        </div>

        {/* Geo error warning */}
        {geoError && (
          <div style={{
            padding: '14px 18px', borderRadius: 'var(--radius-md)',
            background: 'var(--warning-dim)', border: '1px solid rgba(245,158,11,0.3)',
            color: 'var(--warning)', fontSize: '13px',
            display: 'flex', alignItems: 'center', gap: '8px',
            marginBottom: '24px',
          }}>
            ⚠️ {geoError}
          </div>
        )}

        {/* Stats bar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '14px', marginBottom: '32px',
        }}>
          <StatCard icon="🔔" label="Total Alarms" value={alarms.length} color="var(--accent)" />
          <StatCard icon="✅" label="Active" value={activeCount} color="var(--success)" />
          <StatCard icon="⚡" label="Triggered" value={user?.alarmsTriggered || 0} color="var(--warning)" />
          <StatCard
            icon={watching ? '📡' : '💤'}
            label="GPS Status"
            value={watching ? (position ? 'Live' : 'Searching...') : 'Off'}
            color={watching ? 'var(--success)' : 'var(--text-muted)'}
          />
        </div>

        {/* Main content grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.3fr)',
          gap: '24px',
          alignItems: 'start',
        }}
        className="dashboard-grid"
        >
          {/* Alarms list */}
          <div>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: '16px',
            }}>
              <h2 style={{
                fontFamily: 'var(--font-display)', fontWeight: 700,
                fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px',
              }}>
                <Bell size={18} color="var(--accent)" />
                Your Alarms
              </h2>
              <button
                onClick={fetchAlarms}
                style={{
                  display: 'flex', alignItems: 'center', gap: '5px',
                  padding: '6px 12px', borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-glass)', border: '1px solid var(--border)',
                  color: 'var(--text-muted)', fontSize: '12px', cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <RefreshCw size={12} /> Refresh
              </button>
            </div>

            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
                <div style={{ textAlign: 'center' }}>
                  <Loader size={32} color="var(--accent)" style={{ animation: 'spin 1s linear infinite' }} />
                  <p style={{ color: 'var(--text-muted)', marginTop: '12px', fontSize: '14px' }}>Loading alarms...</p>
                </div>
              </div>
            ) : alarms.length === 0 ? (
              <EmptyState onAdd={() => setShowModal(true)} />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {alarms.map((alarm, i) => (
                  <div key={alarm._id} style={{ animation: `fadeIn 0.4s ease ${i * 0.05}s both` }}>
                    <AlarmCard
                      alarm={alarm}
                      userPosition={position}
                      onDelete={handleDelete}
                      onToggle={handleToggle}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Live map */}
          <div>
            <h2 style={{
              fontFamily: 'var(--font-display)', fontWeight: 700,
              fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px',
              marginBottom: '16px',
            }}>
              <MapPin size={18} color="var(--accent)" />
              Live Map
              {position && (
                <span style={{
                  fontSize: '11px', fontFamily: 'var(--font-body)',
                  padding: '2px 8px', borderRadius: 'var(--radius-full)',
                  background: 'var(--success-dim)', color: 'var(--success)',
                  border: '1px solid rgba(16,217,138,0.2)',
                }}>● LIVE</span>
              )}
            </h2>

            <div style={{
              height: '520px', borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border)',
              overflow: 'hidden',
              background: 'var(--bg-secondary)',
            }}>
              <TrackingMap alarms={alarms} userPosition={position} />
            </div>

            {/* Position info */}
            {position && (
              <div style={{
                marginTop: '12px', padding: '12px 16px',
                background: 'var(--bg-glass)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                display: 'flex', gap: '20px', flexWrap: 'wrap',
                fontSize: '12px', color: 'var(--text-muted)',
              }}>
                <span>📍 {position.lat.toFixed(5)}, {position.lng.toFixed(5)}</span>
                <span>🎯 Accuracy: ~{Math.round(position.accuracy)}m</span>
              </div>
            )}

            {!watching && (
              <div style={{
                marginTop: '12px', padding: '14px 16px',
                background: 'var(--bg-glass)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)', textAlign: 'center',
                fontSize: '13px', color: 'var(--text-secondary)',
              }}>
                <NavigationOff size={16} style={{ marginBottom: '6px', color: 'var(--text-muted)' }} />
                <div>Enable GPS tracking to see your position and trigger alarms</div>
                <button
                  onClick={startWatching}
                  style={{
                    marginTop: '10px', padding: '7px 16px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--accent-dim)',
                    border: '1px solid var(--border-accent)',
                    color: 'var(--accent)', fontSize: '12px', fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  Start Tracking
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <AddAlarmModal
          onClose={() => setShowModal(false)}
          onSubmit={handleCreate}
          userPosition={position}
        />
      )}

      <style>{`
        @media (max-width: 900px) {
          .dashboard-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <div style={{
      padding: '18px 20px',
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      transition: 'all var(--transition-base)',
    }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-bright)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; }}
    >
      <div style={{ fontSize: '22px', marginBottom: '6px' }}>{icon}</div>
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: '26px', fontWeight: 800, color,
        letterSpacing: '-0.5px',
      }}>
        {value}
      </div>
      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        {label}
      </div>
    </div>
  );
}

function EmptyState({ onAdd }) {
  return (
    <div style={{
      padding: '60px 24px', textAlign: 'center',
      background: 'var(--bg-card)',
      border: '1px dashed var(--border)',
      borderRadius: 'var(--radius-xl)',
    }}>
      <div style={{
        width: 72, height: 72, borderRadius: '50%',
        background: 'var(--accent-dim)',
        border: '1px solid var(--border-accent)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 20px',
        animation: 'float 3s ease-in-out infinite',
      }}>
        <BellOff size={28} color="var(--accent)" />
      </div>
      <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '20px', marginBottom: '8px' }}>
        No alarms yet
      </h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px', maxWidth: '260px', margin: '0 auto 24px' }}>
        Create your first location-based alarm and never miss a destination again.
      </p>
      <button
        onClick={onAdd}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '12px 24px', borderRadius: 'var(--radius-md)',
          background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
          color: 'white', fontWeight: 600, fontSize: '14px',
          border: 'none', cursor: 'pointer',
        }}
      >
        <Plus size={16} /> Add First Alarm
      </button>
    </div>
  );
}
