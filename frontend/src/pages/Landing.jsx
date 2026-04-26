import { Link } from 'react-router-dom';
import { MapPin, Bell, Navigation, Shield, Zap, Globe, ArrowRight, Check } from 'lucide-react';

export default function Landing() {
  return (
    <div style={{ minHeight: '100vh', overflowX: 'hidden' }}>
      {/* Hero */}
      <section style={{
        minHeight: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative',
        padding: '100px 24px 60px',
      }}>
        {/* Background decoration */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 80% 60% at 50% -20%, rgba(0,212,255,0.1) 0%, transparent 60%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', top: '20%', left: '10%',
          width: '300px', height: '300px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.06), transparent)',
          pointerEvents: 'none',
        }} />

        {/* Animated grid dots */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.4,
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: '800px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 16px', borderRadius: 'var(--radius-full)',
            background: 'var(--accent-dim)', border: '1px solid var(--border-accent)',
            fontSize: '13px', color: 'var(--accent)', fontWeight: 500,
            marginBottom: '32px',
            animation: 'fadeIn 0.6s ease both',
          }}>
            <div style={{
              width: 7, height: 7, borderRadius: '50%',
              background: 'var(--accent)',
              animation: 'pulse-dot 2s ease infinite',
            }} />
            Location-Aware Alarm System
          </div>

          {/* Headline */}
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(42px, 7vw, 80px)',
            fontWeight: 800, lineHeight: 1.05,
            letterSpacing: '-2px',
            marginBottom: '24px',
            animation: 'fadeIn 0.6s ease 0.1s both',
          }}>
            Alarms that{' '}
            <span className="text-gradient">know where</span>
            <br />you are
          </h1>

          <p style={{
            fontSize: 'clamp(16px, 2vw, 20px)',
            color: 'var(--text-secondary)',
            lineHeight: 1.7,
            maxWidth: '560px', margin: '0 auto 40px',
            animation: 'fadeIn 0.6s ease 0.2s both',
          }}>
            Stop missing stops. GeoAlarm triggers the moment you enter any location radius — 
            no more checking the clock, just arrive and be reminded.
          </p>

          {/* CTAs */}
          <div style={{
            display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap',
            animation: 'fadeIn 0.6s ease 0.3s both',
          }}>
            <Link to="/signup" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '14px 28px', borderRadius: 'var(--radius-lg)',
              background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
              color: 'white', fontWeight: 700, fontSize: '15px',
              boxShadow: '0 0 30px rgba(0,212,255,0.3)',
              transition: 'all var(--transition-base)',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 0 50px rgba(0,212,255,0.5)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 0 30px rgba(0,212,255,0.3)'; }}
            >
              Start for Free <ArrowRight size={16} />
            </Link>
            <Link to="/login" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '14px 28px', borderRadius: 'var(--radius-lg)',
              background: 'var(--bg-glass)', border: '1px solid var(--border)',
              color: 'var(--text-secondary)', fontWeight: 600, fontSize: '15px',
              transition: 'all var(--transition-base)',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-bright)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '80px 24px', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 44px)',
            fontWeight: 800, letterSpacing: '-1px',
          }}>
            Built for the real world
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '12px', fontSize: '16px' }}>
            Everything you need to never miss a location again.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
        }}>
          {FEATURES.map((f, i) => (
            <FeatureCard key={i} {...f} delay={i * 0.1} />
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{
        padding: '80px 24px',
        background: 'linear-gradient(135deg, rgba(0,212,255,0.03), rgba(124,58,237,0.03))',
        borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 40px)',
            fontWeight: 800, letterSpacing: '-1px', marginBottom: '48px',
          }}>
            How it works
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {STEPS.map((step, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '20px',
                padding: '20px 24px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                textAlign: 'left',
                transition: 'border-color var(--transition-base)',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-accent)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                <div style={{
                  width: 48, height: 48, flexShrink: 0,
                  borderRadius: 'var(--radius-md)',
                  background: 'linear-gradient(135deg, var(--accent-dim), var(--accent-2-dim))',
                  border: '1px solid var(--border-accent)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '22px',
                }}>
                  {step.icon}
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '16px', marginBottom: '4px' }}>
                    {i + 1}. {step.title}
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '100px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 48px)',
            fontWeight: 800, letterSpacing: '-1.5px', marginBottom: '20px',
          }}>
            Ready to never miss<br />
            <span className="text-gradient">a location again?</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '36px', fontSize: '16px' }}>
            Free to use. No credit card required.
          </p>
          <Link to="/signup" style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            padding: '16px 36px', borderRadius: 'var(--radius-lg)',
            background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
            color: 'white', fontWeight: 700, fontSize: '16px',
            boxShadow: '0 0 40px rgba(0,212,255,0.3)',
          }}>
            Get Started Free <ArrowRight size={18} />
          </Link>
          <div style={{
            display: 'flex', justifyContent: 'center', gap: '24px',
            marginTop: '28px', flexWrap: 'wrap',
          }}>
            {['No credit card', 'Multiple alarms', 'Works offline'].map((t) => (
              <span key={t} style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                fontSize: '13px', color: 'var(--text-muted)',
              }}>
                <Check size={13} color="var(--success)" /> {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border)',
        padding: '24px',
        textAlign: 'center',
        color: 'var(--text-muted)', fontSize: '13px',
      }}>
        © 2024 GeoAlarm. Built with ❤️ for location-aware living.
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc, delay }) {
  return (
    <div style={{
      padding: '28px', borderRadius: 'var(--radius-lg)',
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      transition: 'all var(--transition-base)',
      animation: `fadeIn 0.5s ease ${delay}s both`,
      cursor: 'default',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.borderColor = 'var(--border-accent)';
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = 'var(--shadow-accent)';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.borderColor = 'var(--border)';
      e.currentTarget.style.transform = 'none';
      e.currentTarget.style.boxShadow = 'none';
    }}
    >
      <div style={{
        width: 48, height: 48, borderRadius: 'var(--radius-md)',
        background: 'var(--accent-dim)', border: '1px solid var(--border-accent)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: '16px', color: 'var(--accent)',
      }}>
        {icon}
      </div>
      <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '17px', marginBottom: '8px' }}>{title}</h3>
      <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{desc}</p>
    </div>
  );
}

const FEATURES = [
  { icon: <MapPin size={22} />, title: 'Set by location', desc: 'Drop a pin anywhere on the interactive map and define a radius. Your alarm triggers the moment you step inside it.' },
  { icon: <Bell size={22} />, title: 'Smart alerts', desc: 'Get notified via browser notifications, sound alarms with 5 different tones, and bold on-screen popups.' },
  { icon: <Navigation size={22} />, title: 'Live tracking', desc: 'Continuous GPS tracking using your browser\'s Geolocation API with the precise Haversine formula for distance.' },
  { icon: <Shield size={22} />, title: 'Secure & private', desc: 'JWT authentication, bcrypt password hashing, and fully protected API routes keep your data safe.' },
  { icon: <Zap size={22} />, title: 'Multiple alarms', desc: 'Create as many location alarms as you need. Enable, disable, or delete them anytime from your dashboard.' },
  { icon: <Globe size={22} />, title: 'Alarm history', desc: 'Track every time an alarm has been triggered with detailed logs and analytics on your alarm activity.' },
];

const STEPS = [
  { icon: '🗺️', title: 'Pick a location on the map', desc: 'Tap anywhere on the interactive map to set your alarm\'s destination point.' },
  { icon: '📏', title: 'Set a radius', desc: 'Choose how close you need to be — from 50m to 2km — before the alarm fires.' },
  { icon: '🔔', title: 'Activate tracking', desc: 'Enable GPS tracking on your dashboard and go about your day.' },
  { icon: '🚨', title: 'Get alerted on arrival', desc: 'The moment you enter the radius, GeoAlarm sounds off and sends a notification.' },
];
