import { useState, useEffect, useRef } from 'react';
import request from 'swipes-core-js/utils/request';

export default function useRequest(endpoint, params) {
  const [reqId, setReqId] = useState(1);

  const defaultState = { loading: true, retry };
  const [req, setReq] = useState(defaultState);

  function retry() {
    setReq(defaultState);
    setReqId(count => count + 1);
  }

  const uniqueResRef = useRef(null);
  useEffect(() => {
    uniqueResRef.current = reqId;
    request(endpoint, params).then(res => {
      if (uniqueResRef.current !== reqId) {
        // Retry was called, or component was unmounted
        return;
      }
      if (res.ok) {
        setReq({ result: res, retry });
      } else {
        setReq({ error: res.error, retry });
      }
    });
    return () => {
      uniqueResRef.current = null;
    };
  }, [reqId]);

  return req;
}
