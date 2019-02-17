import { useEffect } from 'react';

export default function useUpdate(handler) {
  useEffect(() => {
    console.log('subscribing');
    if (typeof window === 'undefined' || typeof window.socket === 'undefined') {
      console.warn('useUpdate expects window and window.socket to be set');
      return;
    }
    const unsub = window.socket.subscribe(update => {
      handler(update);
    });
    return () => {
      console.log('unsubscribing');
      unsub();
    };
  }, []);
}
