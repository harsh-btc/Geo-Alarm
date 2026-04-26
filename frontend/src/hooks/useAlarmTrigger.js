import { useEffect, useRef, useCallback } from 'react';
import { haversineDistance } from '../utils/haversine';
import { triggerAlarm as recordTrigger } from '../api/alarms';
import toast from 'react-hot-toast';

// Generate alarm sound using Web Audio API
function createAlarmSound(type = 'default') {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();

  const play = () => {
    const sounds = {
      default: () => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.5, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.5);
        setTimeout(play2, 600);
      },
      chime: () => {
        [523, 659, 784, 1047].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = 'triangle';
          osc.frequency.value = freq;
          gain.gain.setValueAtTime(0.3, ctx.currentTime + i * 0.15);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.15 + 0.6);
          osc.start(ctx.currentTime + i * 0.15);
          osc.stop(ctx.currentTime + i * 0.15 + 0.6);
        });
      },
      beep: () => {
        for (let i = 0; i < 3; i++) {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.value = 1000;
          gain.gain.setValueAtTime(0.4, ctx.currentTime + i * 0.25);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.25 + 0.15);
          osc.start(ctx.currentTime + i * 0.25);
          osc.stop(ctx.currentTime + i * 0.25 + 0.15);
        }
      },
      alert: () => {
        [880, 660, 880, 660].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = 'square';
          osc.frequency.value = freq;
          gain.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.2);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.2 + 0.18);
          osc.start(ctx.currentTime + i * 0.2);
          osc.stop(ctx.currentTime + i * 0.2 + 0.18);
        });
      },
      pulse: () => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.connect(lfoGain);
        lfoGain.connect(gain.gain);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 440;
        lfo.frequency.value = 6;
        lfoGain.gain.value = 0.3;
        gain.gain.value = 0.3;
        osc.start(ctx.currentTime);
        lfo.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 1.5);
        lfo.stop(ctx.currentTime + 1.5);
      },
    };

    const fn = sounds[type] || sounds.default;
    fn();
  };

  let play2 = () => {};
  play2 = () => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.5);
  };

  return { play };
}

function showBrowserNotification(alarm) {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(`📍 GeoAlarm: ${alarm.locationName}`, {
      body: `You've arrived within ${alarm.radius}m of your destination!`,
      icon: '/favicon.svg',
      tag: `alarm-${alarm._id}`,
    });
  }
}

export function useAlarmTrigger({ alarms, position, onAlarmFire }) {
  // Track which alarms have already been triggered in this session
  const triggeredSet = useRef(new Set());
  // Track cooldown per alarm (5 min before re-triggering same alarm)
  const lastTriggerTime = useRef({});

  const COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes

  const checkAlarms = useCallback(() => {
    if (!position || !alarms?.length) return;

    const activeAlarms = alarms.filter((a) => a.isActive);

    for (const alarm of activeAlarms) {
      const distance = haversineDistance(
        position.lat,
        position.lng,
        alarm.latitude,
        alarm.longitude
      );

      const now = Date.now();
      const lastTime = lastTriggerTime.current[alarm._id] || 0;
      const withinCooldown = now - lastTime < COOLDOWN_MS;

      if (distance <= alarm.radius && !withinCooldown) {
        // TRIGGER!
        lastTriggerTime.current[alarm._id] = now;

        // Play sound
        try {
          const sound = createAlarmSound(alarm.sound || 'default');
          sound.play();
        } catch (e) {
          console.warn('Audio play failed:', e);
        }

        // Browser notification
        showBrowserNotification(alarm);

        // Toast notification
        toast.success(
          `📍 ARRIVED: ${alarm.locationName} — within ${alarm.radius}m`,
          { duration: 8000, position: 'top-center' }
        );

        // Record trigger on backend
        recordTrigger(alarm._id).catch(() => {});

        // Callback
        if (onAlarmFire) onAlarmFire(alarm, distance);
      }
    }
  }, [alarms, position, onAlarmFire]);

  // Check on every position update
  useEffect(() => {
    checkAlarms();
  }, [position, checkAlarms]);

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);
}
