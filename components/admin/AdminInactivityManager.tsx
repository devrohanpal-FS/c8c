'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Clock, AlertTriangle } from 'lucide-react';

const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000;
const WARNING_THRESHOLD_MS = 28 * 60 * 1000;
const TOUCH_SERVER_THROTTLE_MS = 10 * 1000;

export const AdminInactivityManager: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session, status, update: updateSession } = useSession();
  const userRole = (session?.user as { role?: string })?.role;
  const isProtectedRole = userRole === 'ADMIN' || userRole === 'SUPER_ADMIN';

  const lastActivityRef = useRef<number>(Date.now());
  const lastServerTouchRef = useRef<number>(Date.now());
  const [showWarning, setShowWarning] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(15);
  const isLoggingOutRef = useRef(false);

  useEffect(() => {
    if (status !== 'authenticated' || !isProtectedRole) return;

    lastActivityRef.current = Date.now();
    lastServerTouchRef.current = Date.now();


    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel('c8c_admin_activity');
      channel.onmessage = (event) => {
        if (event.data?.type === 'USER_INTERACTION' && event.data?.timestamp) {
          lastActivityRef.current = event.data.timestamp;
          setShowWarning(false);
        } else if (event.data?.type === 'SESSION_EXPIRED') {
          handleLogout();
        }
      };
    } catch {

    }

    const touchServerActivity = async () => {
      const now = Date.now();
      if (now - lastServerTouchRef.current >= TOUCH_SERVER_THROTTLE_MS) {
        lastServerTouchRef.current = now;
        try {
          await updateSession({ lastActivity: now });
          await fetch('/api/admin/activity', { method: 'POST' });
        } catch {

        }
      }
    };

    const handleUserInteraction = () => {
      if (isLoggingOutRef.current) return;
      const now = Date.now();
      lastActivityRef.current = now;
      setShowWarning(false);

      if (channel) {
        try {
          channel.postMessage({ type: 'USER_INTERACTION', timestamp: now });
        } catch {

        }
      }

      touchServerActivity();
    };

    const handleLogout = async () => {
      if (isLoggingOutRef.current) return;
      isLoggingOutRef.current = true;

      if (channel) {
        try {
          channel.postMessage({ type: 'SESSION_EXPIRED' });
        } catch {

        }
      }

      try {
        await fetch('/api/admin/activity', { method: 'POST' });
      } catch {

      }

      signOut({ callbackUrl: '/admin/login' });
    };


    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click'];
    events.forEach((evt) => {
      window.addEventListener(evt, handleUserInteraction, { passive: true });
    });


    const timerInterval = setInterval(() => {
      const elapsed = Date.now() - lastActivityRef.current;

      if (elapsed >= INACTIVITY_TIMEOUT_MS) {
        clearInterval(timerInterval);
        handleLogout();
      } else if (elapsed >= WARNING_THRESHOLD_MS) {
        const secondsLeft = Math.max(1, Math.ceil((INACTIVITY_TIMEOUT_MS - elapsed) / 1000));
        setRemainingSeconds(secondsLeft);
        setShowWarning(true);
      } else {
        setShowWarning(false);
      }
    }, 1000);

    return () => {
      clearInterval(timerInterval);
      events.forEach((evt) => {
        window.removeEventListener(evt, handleUserInteraction);
      });
      if (channel) {
        channel.close();
      }
    };
  }, [status, isProtectedRole, updateSession]);

  return (
    <>
      {children}

      { }
      {showWarning && (
        <div className="fixed bottom-6 right-6 z-[999] max-w-md bg-[#161616] border border-[#ffd700]/50 rounded-2xl p-5 shadow-2xl backdrop-blur-md animate-bounce text-left flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-[#ffd700] shrink-0 mt-0.5" />
          <div className="flex flex-col gap-1">
            <span className="font-mono text-xs font-bold text-[#ffd700] uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> Session Expiring Soon ({remainingSeconds}s)
            </span>
            <p className="font-sans text-xs text-gray-300">
              Your admin session will automatically expire in <strong className="text-white font-mono">{remainingSeconds} seconds</strong> due to inactivity. Move your mouse or click to stay logged in.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminInactivityManager;