import React, { useState, useEffect } from 'react';
import { Timer, AlertTriangle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { resetReservationTimer } from '@/features/checkout/checkoutSlice';

export const ReservationCountdown: React.FC<{ onExpire?: () => void }> = ({ onExpire }) => {
  const dispatch = useAppDispatch();
  const expiresAt = useAppSelector((state) => state.checkout.reservationExpiresAt);
  const [secondsRemaining, setSecondsRemaining] = useState(
    Math.max(0, Math.floor((expiresAt - Date.now()) / 1000))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const left = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
      setSecondsRemaining(left);
      if (left === 0 && onExpire) {
        onExpire();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, onExpire]);

  const mins = Math.floor(secondsRemaining / 60);
  const secs = secondsRemaining % 60;
  const isUrgent = mins < 3;

  return (
    <div
      className={`p-3 rounded-lg border text-xs flex items-center justify-between transition-colors ${
        isUrgent
          ? 'bg-rose-950/50 border-rose-500/40 text-rose-300'
          : 'bg-[#1D0C30] border-brand-gold/25 text-brand-gold-light'
      }`}
    >
      <div className="flex items-center gap-2">
        {isUrgent ? (
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 animate-bounce" />
        ) : (
          <Timer className="w-4 h-4 text-brand-gold shrink-0" />
        )}
        <span>
          {isUrgent ? (
            <strong>Reservation expiring soon!</strong>
          ) : (
            <span>Handloom items reserved for you:</span>
          )}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <span className="font-mono text-sm font-bold tracking-wider">
          {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
        </span>

        {secondsRemaining === 0 && (
          <button
            type="button"
            onClick={() => dispatch(resetReservationTimer())}
            className="text-[10px] uppercase font-bold text-brand-gold hover:underline"
          >
            Refresh
          </button>
        )}
      </div>
    </div>
  );
};
