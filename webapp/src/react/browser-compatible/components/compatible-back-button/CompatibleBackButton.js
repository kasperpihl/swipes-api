import React from 'react';
import PropTypes from 'prop-types';
// import { bindAll } from 'swipes-core-js/classes/utils';
// import { map, list } from 'react-immutable-proptypes';
// import { setupDelegate } from 'react-delegate';
// import SWView from 'SWView';

import Icon from 'Icon';
import './styles/compatible-back-button.scss';

const CompatibleBackButton = (props) => {
  const {
    onClick,
  } = props;

  return (
    <div className="compatible-back-button" onClick={onClick}>
      <Icon icon="ArrowLeftLine" className="compatible-back-button__svg" />
    </div>
  );
};

export default CompatibleBackButton;

const { string, func } = PropTypes;

CompatibleBackButton.propTypes = {
  onClick: func,
};
