import { useState, useEffect } from 'react';
import { TIMEZONE } from '@/constants/profile';

/**
 * Custom hook returning a live-ticking clock string for a fixed timezone.
 * @param timeZone - IANA timezone name (default: the profile's TIMEZONE)
 * @returns The current time formatted as HH:MM:SS, or '' before first tick
 */
export const useLocalClock = (timeZone: string = TIMEZONE): string => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat('en-GB', {
      timeZone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });

    const tick = () => setTime(formatter.format(new Date()));

    tick();
    const interval = setInterval(tick, 1000);

    return () => clearInterval(interval);
  }, [timeZone]);

  return time;
};
