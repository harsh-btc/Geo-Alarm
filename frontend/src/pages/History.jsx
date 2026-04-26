import { useState, useEffect } from 'react';
import { Clock, MapPin, BarChart2, Loader } from 'lucide-react';
import { getAlarmHistory } from '../api/alarms';
import toast from 'react-hot-toast';

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getAlarmHistory();
        setHistory(data.history);
      } catch {
        toast.error('Failed to load history');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  // Group by date
  const grouped = history.reduce((acc, item) => {
    const date = new Date(item.triggeredAt).toLocaleDateString('en-US', {
      weekday: 'long', month: 'long', day: 'numeric',
    });
    if (!acc[date]) acc[date] = [];
    acc[date].push(item);
    return acc;
  }, {});

  return (
    <div style={{ minHeight: '100vh', paddingTop: '64px', padding: '100px 24px 60px' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '32px', fontWeight: 800, letterSpacing: '-1px',
            display: 'flex', alignItems: 'center', gap: '12px',
          }}>
            <BarChart2 size={28} color="var(--accent)" /> Alarm History
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '6px', fontSize: '14px' }}>
            Every time one of your location alarms fired
          </p>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
            <Loader size={32} color="var(--accent)" style={{ animation: 'spin 1s linear infinite' }} />
          </div>
        ) : history.length === 0 ? (
          <div style={{
            padding: '80px 24px', textAlign: 'center',
            background: 'var(--bg-card)', border: '1px dashed var(--border)',
            borderRadius: 'var(--radius-xl)',
          }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: 'var(--accent-dim)', border: '1px solid var(--border-accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px', fontSize: '32px',
              animation: 'float 3s ease-in-out infinite',
            }}>
              📋
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '20px', marginBottom: '8px' }}>
              No history yet
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              Your triggered alarms will appear here as a log.
            </p>
          </div>
        ) : (
          <div>
            {/* Summary */}
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '32px',
            }}>
              <SummaryCard label="Total Triggers" value={history.length} icon="⚡" />
              <SummaryCard label="Unique Days" value={Object.keys(grouped).length} icon="📅" />
              <SummaryCard
                label="Last Trigger"
                value={history[0] ? new Date(history[0].triggeredAt).toLocaleDateString() : '—'}
                icon="🕐"
              />
            </div>

            {/* Timeline */}
            {Object.entries(grouped).map(([date, items], gi) => (
              <div key={date} style={{ marginBottom: '32px', animation: `fadeIn 0.4s ease ${gi * 0.05}s both` }}>
                <div style={{
                  fontSize: '12px', fontWeight: 600,
                  color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px',
                  marginBottom: '12px', paddingBottom: '8px',
                  borderBottom: '1px solid var(--border)',
                }}>
                  {date} · {items.length} trigger{items.length > 1 ? 's' : ''}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {items.map((item, i) => (
                    <HistoryItem key={item._id || i} item={item} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function HistoryItem({ item }) {
  const time = new Date(item.triggeredAt).toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit',
  });

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '14px',
      padding: '14px 18px',
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-md)',
      transition: 'all var(--transition-fast)',
    }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-accent)'; e.currentTarget.style.transform = 'translateX(4px)'; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; }}
    >
      <div style={{
        width: 36, height: 36, borderRadius: '50%',
        background: 'var(--success-dim)',
        border: '1px solid rgba(16,217,138,0.25)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <MapPin size={15} color="var(--success)" />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontWeight: 600, fontSize: '14px',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {item.locationName}
        </div>
        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
          {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)} · {item.radius}m radius
        </div>
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', gap: '5px',
        fontSize: '12px', color: 'var(--text-muted)', flexShrink: 0,
      }}>
        <Clock size={12} /> {time}
      </div>

      <div style={{
        padding: '3px 10px', borderRadius: 'var(--radius-full)',
        background: 'var(--success-dim)', color: 'var(--success)',
        fontSize: '11px', fontWeight: 600,
        border: '1px solid rgba(16,217,138,0.2)',
        flexShrink: 0,
      }}>
        Triggered
      </div>
    </div>
  );
}

function SummaryCard({ label, value, icon }) {
  return (
    <div style={{
      padding: '20px', textAlign: 'center',
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
    }}>
      <div style={{ fontSize: '20px', marginBottom: '8px' }}>{icon}</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 800 }}>{value}</div>
      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        {label}
      </div>
    </div>
  );
}
