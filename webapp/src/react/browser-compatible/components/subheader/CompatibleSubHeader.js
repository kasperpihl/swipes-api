import React from 'react';
import PropTypes from 'prop-types';
// import { bindAll } from 'swipes-core-js/classes/utils';
// import { map, list } from 'react-immutable-proptypes';
// import { setupDelegate } from 'react-delegate';
// import SWView from 'SWView';

// import Icon from 'Icon';
import './styles/compatible-subheader.scss';

const CompatibleSubHeader = (props) => {
  const {
    title,
  } = props;

  return (
    <h4 className="compatible-subheader">
      {title}
    </h4>
  );
};

export default CompatibleSubHeader;

const { string, func } = PropTypes;

CompatibleSubHeader.propTypes = {
  title: string,
  onClick: func,
};
