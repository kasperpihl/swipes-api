import { useRef, useEffect } from 'react';

export default function useUnmountedRef() {
  const unmountedRef = useRef();
  useEffect(
    () => () => {
      unmountedRef.current = true;
    },
    []
  );
  return unmountedRef;
}
