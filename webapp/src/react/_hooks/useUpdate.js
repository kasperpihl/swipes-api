import { useEffect } from 'react';

export default function useUpdate(handler) {
  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.socket === 'undefined') {
      console.warn('useUpdate expects window and window.socket to be set');
      return;
    }
    return window.socket.subscribe(update => {
      handler(update);
    });
  }, []);
}
