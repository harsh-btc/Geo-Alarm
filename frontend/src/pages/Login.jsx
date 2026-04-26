import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, MapPin, ArrowRight } from 'lucide-react';
import { loginUser } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { persistAuth } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
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
      const { data } = await loginUser(form);
      persistAuth(data.user, data.token);
      toast.success(`Welcome back, ${data.user.name}! 👋`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '100px 24px 40px',
      position: 'relative',
    }}>
      {/* Background */}
      <div style={{
        position: 'fixed', inset: 0,
        background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(0,212,255,0.07) 0%, transparent 60%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        width: '100%', maxWidth: '440px',
        animation: 'scaleIn 0.3s ease',
      }}>
        {/* Card */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)',
          padding: '40px',
          boxShadow: 'var(--shadow-lg)',
        }}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{
              width: 56, height: 56, borderRadius: '16px',
              background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px',
              boxShadow: '0 0 30px rgba(0,212,255,0.3)',
            }}>
              <MapPin size={26} color="white" />
            </div>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '26px', fontWeight: 800, letterSpacing: '-0.5px',
              marginBottom: '6px',
            }}>
              Welcome back
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              Sign in to your GeoAlarm account
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <InputField
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

            <InputField
              label="Password"
              icon={<Lock size={16} />}
              type={showPass ? 'text' : 'password'}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Your password"
              error={errors.password}
              autoComplete="current-password"
              suffix={
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  style={{
                    background: 'none', border: 'none',
                    color: 'var(--text-muted)', cursor: 'pointer',
                    display: 'flex', alignItems: 'center',
                    padding: '4px',
                  }}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
            />

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '13px',
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
                color: 'white', fontWeight: 700, fontSize: '15px',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                transition: 'opacity var(--transition-fast)',
                boxShadow: '0 4px 20px rgba(0,212,255,0.2)',
                marginTop: '6px',
              }}
            >
              {loading ? (
                <><div className="spinner" style={{ borderTopColor: 'white', width: 16, height: 16 }} /> Signing in...</>
              ) : (
                <>Sign In <ArrowRight size={15} /></>
              )}
            </button>
          </form>

          <p style={{
            textAlign: 'center', marginTop: '24px',
            fontSize: '14px', color: 'var(--text-secondary)',
          }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{
              color: 'var(--accent)', fontWeight: 600,
              transition: 'opacity var(--transition-fast)',
            }}>
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function InputField({ label, icon, type, name, value, onChange, placeholder, error, autoComplete, suffix }) {
  const [focused, setFocused] = useState(false);

  return (
    <div>
      <label style={{
        display: 'block', fontSize: '13px', fontWeight: 500,
        color: 'var(--text-secondary)', marginBottom: '8px',
      }}>
        {label}
      </label>
      <div style={{
        display: 'flex', alignItems: 'center',
        background: 'var(--bg-glass)',
        border: `1px solid ${error ? 'var(--danger)' : focused ? 'var(--accent)' : 'var(--border)'}`,
        borderRadius: 'var(--radius-md)',
        padding: '0 14px',
        transition: 'border-color var(--transition-fast)',
        boxShadow: focused && !error ? '0 0 0 3px var(--accent-dim)' : 'none',
      }}>
        <span style={{ color: error ? 'var(--danger)' : focused ? 'var(--accent)' : 'var(--text-muted)', flexShrink: 0 }}>
          {icon}
        </span>
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            flex: 1, padding: '12px 10px',
            background: 'none', border: 'none', outline: 'none',
            color: 'var(--text-primary)', fontSize: '14px',
          }}
        />
        {suffix}
      </div>
      {error && (
        <p style={{ fontSize: '12px', color: 'var(--danger)', marginTop: '5px' }}>
          {error}
        </p>
      )}
    </div>
  );
}
