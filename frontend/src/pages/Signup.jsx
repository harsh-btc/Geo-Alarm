import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, MapPin, ArrowRight, Check } from 'lucide-react';
import { registerUser } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const requirements = [
  { label: 'At least 6 characters', test: (p) => p.length >= 6 },
  { label: 'Contains a letter', test: (p) => /[a-zA-Z]/.test(p) },
  { label: 'Contains a number', test: (p) => /\d/.test(p) },
];

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { persistAuth } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!form.name.trim() || form.name.trim().length < 2) e.name = 'Name must be at least 2 characters';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors((er) => ({ ...er, [e.target.name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const { data } = await registerUser(form);
      persistAuth(data.user, data.token);
      toast.success(`Account created! Welcome, ${data.user.name}! 🎉`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = requirements.filter((r) => r.test(form.password)).length;

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '100px 24px 40px',
      position: 'relative',
    }}>
      <div style={{
        position: 'fixed', inset: 0,
        background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(124,58,237,0.07) 0%, transparent 60%)',
        pointerEvents: 'none',
      }} />

      <div style={{ width: '100%', maxWidth: '460px', animation: 'scaleIn 0.3s ease' }}>
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)',
          padding: '40px',
          boxShadow: 'var(--shadow-lg)',
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{
              width: 56, height: 56, borderRadius: '16px',
              background: 'linear-gradient(135deg, var(--accent-2), var(--accent))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px',
              boxShadow: '0 0 30px rgba(124,58,237,0.3)',
            }}>
              <MapPin size={26} color="white" />
            </div>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '26px', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: '6px',
            }}>
              Create your account
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              Start setting location-based alarms in seconds
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <Field
              label="Full name"
              icon={<User size={16} />}
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="John Doe"
              error={errors.name}
              autoComplete="name"
            />
            <Field
              label="Email address"
              icon={<Mail size={16} />}
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              error={errors.email}
              autoComplete="email"
            />
            <div>
              <Field
                label="Password"
                icon={<Lock size={16} />}
                type={showPass ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                error={errors.password}
                autoComplete="new-password"
                suffix={
                  <button type="button" onClick={() => setShowPass((s) => !s)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', padding: '4px' }}>
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
              />

              {/* Password strength */}
              {form.password && (
                <div style={{ marginTop: '10px' }}>
                  <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
                    {[0, 1, 2].map((i) => (
                      <div key={i} style={{
                        flex: 1, height: '3px', borderRadius: '2px',
                        background: i < passwordStrength
                          ? passwordStrength === 1 ? 'var(--danger)' : passwordStrength === 2 ? 'var(--warning)' : 'var(--success)'
                          : 'var(--border)',
                        transition: 'background var(--transition-base)',
                      }} />
                    ))}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {requirements.map((r, i) => {
                      const met = r.test(form.password);
                      return (
                        <div key={i} style={{
                          display: 'flex', alignItems: 'center', gap: '6px',
                          fontSize: '12px',
                          color: met ? 'var(--success)' : 'var(--text-muted)',
                          transition: 'color var(--transition-fast)',
                        }}>
                          <Check size={11} />
                          {r.label}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '13px',
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, var(--accent-2), var(--accent))',
                color: 'white', fontWeight: 700, fontSize: '15px',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                transition: 'opacity var(--transition-fast)',
                boxShadow: '0 4px 20px rgba(124,58,237,0.25)',
                marginTop: '6px',
              }}
            >
              {loading ? (
                <><div className="spinner" style={{ borderTopColor: 'white', width: 16, height: 16 }} /> Creating account...</>
              ) : (
                <>Create Account <ArrowRight size={15} /></>
              )}
            </button>
          </form>

          <p style={{
            textAlign: 'center', marginTop: '24px',
            fontSize: '14px', color: 'var(--text-secondary)',
          }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 600 }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({ label, icon, type, name, value, onChange, placeholder, error, autoComplete, suffix }) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '8px' }}>
        {label}
      </label>
      <div style={{
        display: 'flex', alignItems: 'center',
        background: 'var(--bg-glass)',
        border: `1px solid ${error ? 'var(--danger)' : focused ? 'var(--accent)' : 'var(--border)'}`,
        borderRadius: 'var(--radius-md)', padding: '0 14px',
        transition: 'border-color var(--transition-fast)',
        boxShadow: focused && !error ? '0 0 0 3px var(--accent-dim)' : 'none',
      }}>
        <span style={{ color: error ? 'var(--danger)' : focused ? 'var(--accent)' : 'var(--text-muted)', flexShrink: 0 }}>{icon}</span>
        <input
          type={type} name={name} value={value} onChange={onChange}
          placeholder={placeholder} autoComplete={autoComplete}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{ flex: 1, padding: '12px 10px', background: 'none', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: '14px' }}
        />
        {suffix}
      </div>
      {error && <p style={{ fontSize: '12px', color: 'var(--danger)', marginTop: '5px' }}>{error}</p>}
    </div>
  );
}
