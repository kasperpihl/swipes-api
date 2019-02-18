import { useRef, useEffect } from 'react';
export default function useBeforeUnload(callback) {
  const callbackRef = useRef();

  callbackRef.current = callback;

  useEffect(() => {
    if (callbackRef.current) {
      function beforeUnload(type) {
        callbackRef.current(type === 'unmount' ? 'unmount' : 'beforeunload');
      }
      window.addEventListener('beforeunload', beforeUnload);
      return () => {
        beforeUnload('unmount');
        window.removeEventListener('beforeunload', beforeUnload);
      };
    }
  }, []);
}
