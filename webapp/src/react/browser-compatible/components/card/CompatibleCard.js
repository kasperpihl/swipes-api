import React from 'react';

import './styles/card.scss';

const CompatibleCard = ({ children }) => {

  return (
    <div className="card-wrapper">
      <div className="card">
        {children}
      </div>
    </div>
  );
};

export default CompatibleCard;
