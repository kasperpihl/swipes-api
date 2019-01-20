import { useRef, useState, useEffect, useMemo } from 'react';

const defaultObj = {};

const useLoader = () => {
  const [loadingState, setLoadingState] = useState({});
  const timers = useRef({});

  // Get a memoized object that only change when loading state change 💪
  const loader = useMemo(
    () => ({
      set: createUpdateHandler('loading', 'Loading'),
      error: createUpdateHandler('error', 'Error'),
      success: createUpdateHandler('success', 'Success'),
      check: loadingId => !!(loadingState[loadingId] || defaultObj).loading,
      get: loadingId => loadingState[loadingId] || defaultObj,
      clear
    }),
    [loadingState]
  );

  useEffect(() => {
    // componentWillUnmount
    return () => {
      for (let loadingId in timers.current) {
        clearTimeout(timers.current[loadingId]);
      }
      timers.current = null;
    };
  }, []);

  function createUpdateHandler(loadingKey, defaultLabel) {
    return (loadingId, label = defaultLabel, duration, callback) => {
      if (typeof duration === 'function') {
        callback = duration;
      }
      if (typeof label === 'number') {
        duration = label;
      }
      if (!timers.current) return;

      const newState = Object.assign({}, loadingState, {
        [loadingId]: { [loadingKey]: label }
      });
      setLoadingState(newState);

      startTimerIfNeeded(loadingId, duration, callback);
    };
  }

  function startTimerIfNeeded(loadingId, duration, callback) {
    if (!duration || !timers.current) {
      return;
    }

    clearTimeout(timers.current[loadingId]);

    timers.current[loadingId] = setTimeout(() => {
      clear(loadingId);
      if (typeof callback === 'function') {
        callback();
      }
    }, duration);
  }

  function clear(loadingId) {
    // unmounted
    if (!timers.current) return;

    clearTimeout(timers.current[loadingId]);
    const newState = { ...loadingState };
    delete newState[loadingId];
    setLoadingState(newState);
  }

  return loader;
};

export default useLoader;
