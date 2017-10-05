import React from 'react';
import PropTypes from 'prop-types';
// import { bindAll } from 'swipes-core-js/classes/utils';
// import { map, list } from 'react-immutable-proptypes';
// import { setupDelegate } from 'react-delegate';
// import SWView from 'SWView';
// import Button from 'Button';
import Icon from 'Icon';
import './styles/compatible-button.scss';

const CompatibleButton = (props) => {
  const {
    loading,
    loadingLabel,
    errorLabel,
    successLabel,
    title,
    onClick
  } = props;

  return (
    <a className="compatible-button" onClick={onClick}>
      {
        loading ? (
          <Icon icon="loader" width="12" height="12" />
        ) : (
          title
        )
      }
    </a>
  );
};

export default CompatibleButton;

const { string, func } = PropTypes;

CompatibleButton.propTypes = {
  title: string,
  onClick: func,
};
