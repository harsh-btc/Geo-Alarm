import { useState } from 'react';
import { MapPin, Trash2, ToggleLeft, ToggleRight, Bell, BellOff, Clock, Navigation } from 'lucide-react';
import { formatDistance, haversineDistance } from '../utils/haversine';

const SOUND_LABELS = {
  default: '🔔 Default',
  chime: '🎵 Chime',
  beep: '📡 Beep',
  alert: '🚨 Alert',
  pulse: '💫 Pulse',
};

export default function AlarmCard({ alarm, userPosition, onDelete, onToggle, style = {} }) {
  const [deleting, setDeleting] = useState(false);
  const [toggling, setToggling] = useState(false);

  const distance = userPosition
    ? haversineDistance(userPosition.lat, userPosition.lng, alarm.latitude, alarm.longitude)
    : null;

  const isNear = distance !== null && distance <= alarm.radius;
  const distPercent = distance !== null
    ? Math.max(0, Math.min(100, ((alarm.radius - distance) / alarm.radius) * 100))
    : 0;

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onDelete(alarm._id);
    } finally {
      setDeleting(false);
    }
  };

  const handleToggle = async () => {
    setToggling(true);
    try {
      await onToggle(alarm._id, !alarm.isActive);
    } finally {
      setToggling(false);
    }
  };

  return (
    <div
      style={{
        background: isNear
          ? 'linear-gradient(135deg, rgba(16,217,138,0.08), rgba(13,20,33,0.9))'
          : 'var(--bg-card)',
        border: `1px solid ${isNear ? 'rgba(16,217,138,0.4)' : alarm.isActive ? 'var(--border-accent)' : 'var(--border)'}`,
        borderRadius: 'var(--radius-lg)',
        padding: '20px',
        transition: 'all var(--transition-base)',
        opacity: alarm.isActive ? 1 : 0.6,
        animation: isNear ? 'alarm-flash 1s ease infinite' : 'none',
        boxShadow: isNear ? '0 0 20px rgba(16,217,138,0.2)' : alarm.isActive ? 'var(--shadow-accent)' : 'none',
        ...style,
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flex: 1 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 'var(--radius-md)',
            background: isNear ? 'var(--success-dim)' : alarm.isActive ? 'var(--accent-dim)' : 'var(--bg-glass)',
            border: `1px solid ${isNear ? 'rgba(16,217,138,0.3)' : alarm.isActive ? 'var(--border-accent)' : 'var(--border)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            {alarm.isActive
              ? <Bell size={18} color={isNear ? 'var(--success)' : 'var(--accent)'} />
              : <BellOff size={18} color="var(--text-muted)" />
            }
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700, fontSize: '15px',
              color: 'var(--text-primary)',
              marginBottom: '2px',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {alarm.locationName}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '12px' }}>
              <MapPin size={11} />
              {alarm.latitude.toFixed(4)}, {alarm.longitude.toFixed(4)}
            </div>
          </div>
        </div>

        {/* Status badge */}
        <div style={{
          padding: '3px 10px', borderRadius: 'var(--radius-full)',
          background: isNear ? 'var(--success-dim)' : alarm.isActive ? 'var(--accent-dim)' : 'var(--bg-glass)',
          color: isNear ? 'var(--success)' : alarm.isActive ? 'var(--accent)' : 'var(--text-muted)',
          fontSize: '11px', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase',
          border: `1px solid ${isNear ? 'rgba(16,217,138,0.2)' : alarm.isActive ? 'rgba(0,212,255,0.2)' : 'var(--border)'}`,
          flexShrink: 0,
        }}>
          {isNear ? '🟢 IN RANGE' : alarm.isActive ? 'Active' : 'Inactive'}
        </div>
      </div>

      {/* Stats row */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
        gap: '8px', marginBottom: '14px',
      }}>
        <Stat label="Radius" value={`${alarm.radius}m`} />
        <Stat label="Distance" value={distance !== null ? formatDistance(distance) : '—'} highlight={isNear} />
        <Stat label="Triggers" value={alarm.triggerCount || 0} />
      </div>

      {/* Progress bar (proximity indicator) */}
      {distance !== null && alarm.isActive && (
        <div style={{ marginBottom: '14px' }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px',
          }}>
            <span>Proximity</span>
            <span>{Math.round(distPercent)}%</span>
          </div>
          <div style={{
            height: '4px', borderRadius: '2px',
            background: 'var(--bg-glass)',
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${distPercent}%`,
              background: isNear
                ? 'linear-gradient(90deg, var(--success), #6ee7b7)'
                : 'linear-gradient(90deg, var(--accent), var(--accent-2))',
              borderRadius: '2px',
              transition: 'width 0.5s ease',
            }} />
          </div>
        </div>
      )}

      {/* Metadata */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        fontSize: '12px', color: 'var(--text-muted)', marginBottom: '14px',
        flexWrap: 'wrap',
      }}>
        <span>{SOUND_LABELS[alarm.sound] || '🔔 Default'}</span>
        {alarm.note && <span style={{ color: 'var(--text-secondary)' }}>📝 {alarm.note}</span>}
        {alarm.lastTriggeredAt && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            <Clock size={10} /> Last: {new Date(alarm.lastTriggeredAt).toLocaleDateString()}
          </span>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
        <ActionBtn
          onClick={handleToggle}
          loading={toggling}
          title={alarm.isActive ? 'Deactivate alarm' : 'Activate alarm'}
          color={alarm.isActive ? 'var(--warning)' : 'var(--success)'}
          bg={alarm.isActive ? 'var(--warning-dim)' : 'var(--success-dim)'}
        >
          {alarm.isActive
            ? <ToggleRight size={15} />
            : <ToggleLeft size={15} />
          }
          {alarm.isActive ? 'Disable' : 'Enable'}
        </ActionBtn>
        <ActionBtn
          onClick={handleDelete}
          loading={deleting}
          title="Delete alarm"
          color="var(--danger)"
          bg="var(--danger-dim)"
        >
          <Trash2 size={14} />
          Delete
        </ActionBtn>
      </div>
    </div>
  );
}

function Stat({ label, value, highlight }) {
  return (
    <div style={{
      background: 'var(--bg-glass)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-sm)',
      padding: '8px 10px',
      textAlign: 'center',
    }}>
      <div style={{
        fontSize: '14px', fontWeight: 700,
        fontFamily: 'var(--font-display)',
        color: highlight ? 'var(--success)' : 'var(--text-primary)',
      }}>{value}</div>
      <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '1px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        {label}
      </div>
    </div>
  );
}

function ActionBtn({ onClick, loading, title, color, bg, children }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      title={title}
      style={{
        display: 'flex', alignItems: 'center', gap: '5px',
        padding: '7px 12px', borderRadius: 'var(--radius-md)',
        background: bg, color, border: `1px solid ${color}30`,
        fontSize: '12px', fontWeight: 500,
        cursor: loading ? 'not-allowed' : 'pointer',
        opacity: loading ? 0.6 : 1,
        transition: 'all var(--transition-fast)',
      }}
    >
      {loading ? <div className="spinner" style={{ width: 12, height: 12 }} /> : children}
    </button>
  );
}
