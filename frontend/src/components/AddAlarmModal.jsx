import { useState, useCallback } from 'react';
import { X, MapPin, Bell, Ruler, FileText, Volume2 } from 'lucide-react';
import MapPicker from './MapPicker';
import toast from 'react-hot-toast';

const SOUNDS = [
  { value: 'default', label: '🔔 Default', desc: 'Classic alarm' },
  { value: 'chime', label: '🎵 Chime', desc: 'Melodic chime' },
  { value: 'beep', label: '📡 Beep', desc: 'Triple beep' },
  { value: 'alert', label: '🚨 Alert', desc: 'Urgent alert' },
  { value: 'pulse', label: '💫 Pulse', desc: 'Pulsing tone' },
];

export default function AddAlarmModal({ onClose, onSubmit, userPosition }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    locationName: '',
    latitude: '',
    longitude: '',
    radius: 200,
    sound: 'default',
    note: '',
  });

  const handleLocationSelect = useCallback(({ lat, lng }) => {
    setForm((f) => ({ ...f, latitude: lat, longitude: lng }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const canProceedStep1 = form.latitude !== '' && form.longitude !== '';
  const canProceedStep2 = form.locationName.trim().length > 0;

  const handleSubmit = async () => {
    if (!form.locationName.trim()) return toast.error('Enter a location name');
    if (form.latitude === '' || form.longitude === '') return toast.error('Select a location on the map');

    setLoading(true);
    try {
      await onSubmit({
        locationName: form.locationName.trim(),
        latitude: parseFloat(form.latitude),
        longitude: parseFloat(form.longitude),
        radius: parseInt(form.radius),
        sound: form.sound,
        note: form.note.trim(),
      });
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create alarm');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 2000,
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.2s ease',
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        width: '100%', maxWidth: '720px',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
        animation: 'scaleIn 0.2s ease',
        maxHeight: '90vh',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 24px',
          borderBottom: '1px solid var(--border)',
          background: 'var(--bg-card)',
        }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '18px' }}>
              Add Location Alarm
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
              Step {step} of 2 — {step === 1 ? 'Pick a location' : 'Configure alarm'}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 36, height: 36, borderRadius: 'var(--radius-md)',
              background: 'var(--bg-glass)', border: '1px solid var(--border)',
              color: 'var(--text-secondary)', display: 'flex', alignItems: 'center',
              justifyContent: 'center', cursor: 'pointer',
              transition: 'all var(--transition-fast)',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Step indicators */}
        <div style={{ display: 'flex', padding: '0 24px', gap: '8px', marginTop: '16px' }}>
          {[1, 2].map((s) => (
            <div key={s} style={{
              flex: 1, height: '3px', borderRadius: '2px',
              background: s <= step ? 'var(--accent)' : 'var(--border)',
              transition: 'background var(--transition-base)',
            }} />
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: 'auto', padding: '20px 24px' }}>
          {step === 1 ? (
            <div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                Click anywhere on the map to set your alarm location.
              </p>
              <div style={{
                height: '380px', borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border)', overflow: 'hidden',
              }}>
                <MapPicker
                  selectedLocation={
                    form.latitude !== ''
                      ? { lat: form.latitude, lng: form.longitude, radius: form.radius }
                      : null
                  }
                  onLocationSelect={handleLocationSelect}
                  userPosition={userPosition}
                />
              </div>
              {form.latitude !== '' && (
                <div style={{
                  marginTop: '12px', padding: '12px 16px',
                  background: 'var(--accent-dim)', border: '1px solid var(--border-accent)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '13px', color: 'var(--accent)',
                  display: 'flex', alignItems: 'center', gap: '8px',
                }}>
                  <MapPin size={14} />
                  Location selected: {parseFloat(form.latitude).toFixed(5)}, {parseFloat(form.longitude).toFixed(5)}
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Location Name */}
              <FormField icon={<MapPin size={14} />} label="Location Name *">
                <input
                  type="text"
                  name="locationName"
                  value={form.locationName}
                  onChange={handleChange}
                  placeholder="e.g. Office, Home, Coffee Shop"
                  style={inputStyle}
                />
              </FormField>

              {/* Radius */}
              <FormField icon={<Ruler size={14} />} label={`Radius: ${form.radius}m`}>
                <input
                  type="range"
                  name="radius"
                  min={50}
                  max={2000}
                  step={50}
                  value={form.radius}
                  onChange={handleChange}
                  style={{ width: '100%', accentColor: 'var(--accent)', cursor: 'pointer' }}
                />
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px',
                }}>
                  <span>50m</span><span>500m</span><span>1km</span><span>2km</span>
                </div>
              </FormField>

              {/* Sound */}
              <FormField icon={<Volume2 size={14} />} label="Alarm Sound">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '8px' }}>
                  {SOUNDS.map((s) => (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, sound: s.value }))}
                      style={{
                        padding: '10px',
                        borderRadius: 'var(--radius-md)',
                        background: form.sound === s.value ? 'var(--accent-dim)' : 'var(--bg-glass)',
                        border: `1px solid ${form.sound === s.value ? 'var(--accent)' : 'var(--border)'}`,
                        color: form.sound === s.value ? 'var(--accent)' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all var(--transition-fast)',
                      }}
                    >
                      <div style={{ fontSize: '14px' }}>{s.label}</div>
                      <div style={{ fontSize: '10px', opacity: 0.7, marginTop: '2px' }}>{s.desc}</div>
                    </button>
                  ))}
                </div>
              </FormField>

              {/* Note */}
              <FormField icon={<FileText size={14} />} label="Note (optional)">
                <input
                  type="text"
                  name="note"
                  value={form.note}
                  onChange={handleChange}
                  placeholder="What do you need to remember here?"
                  maxLength={200}
                  style={inputStyle}
                />
              </FormField>

              {/* Coords display */}
              <div style={{
                padding: '12px 16px',
                background: 'var(--bg-glass)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                fontSize: '12px', color: 'var(--text-muted)',
                display: 'flex', gap: '16px',
              }}>
                <span>📍 Lat: {parseFloat(form.latitude).toFixed(6)}</span>
                <span>Lng: {parseFloat(form.longitude).toFixed(6)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex', gap: '10px', justifyContent: 'flex-end',
          padding: '16px 24px',
          borderTop: '1px solid var(--border)',
          background: 'var(--bg-card)',
        }}>
          {step === 2 && (
            <button
              onClick={() => setStep(1)}
              style={{
                padding: '10px 20px', borderRadius: 'var(--radius-md)',
                background: 'var(--bg-glass)', border: '1px solid var(--border)',
                color: 'var(--text-secondary)', fontSize: '14px', cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
            >
              ← Back
            </button>
          )}
          <button
            onClick={step === 1 ? () => { if (canProceedStep1) setStep(2); } : handleSubmit}
            disabled={(step === 1 && !canProceedStep1) || loading}
            style={{
              padding: '10px 24px', borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
              color: 'white', fontSize: '14px', fontWeight: 600,
              cursor: ((step === 1 && !canProceedStep1) || loading) ? 'not-allowed' : 'pointer',
              opacity: ((step === 1 && !canProceedStep1) || loading) ? 0.5 : 1,
              display: 'flex', alignItems: 'center', gap: '8px',
              transition: 'opacity var(--transition-fast)',
              border: 'none',
            }}
          >
            {loading ? (
              <><div className="spinner" style={{ width: 14, height: 14, borderTopColor: 'white' }} /> Creating...</>
            ) : step === 1 ? (
              'Next →'
            ) : (
              <><Bell size={14} /> Create Alarm</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function FormField({ icon, label, children }) {
  return (
    <div>
      <label style={{
        display: 'flex', alignItems: 'center', gap: '6px',
        fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)',
        marginBottom: '8px',
      }}>
        <span style={{ color: 'var(--accent)' }}>{icon}</span>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle = {
  width: '100%', padding: '10px 14px',
  background: 'var(--bg-glass)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-md)',
  color: 'var(--text-primary)',
  fontSize: '14px',
  outline: 'none',
  transition: 'border-color var(--transition-fast)',
};
