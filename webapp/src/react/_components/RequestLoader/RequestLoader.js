import React from 'react';
import Loader from 'src/react/_components/loaders/Loader';

export default function RequestLoader({ req, loaderProps, errorProps }) {
  if (req.loading) {
    return <Loader center {...loaderProps} />;
  }
  if (req.error) {
    return <div onClick={req.retry}>{req.error}</div>;
  }
  return null;
}
