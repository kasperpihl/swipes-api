import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
// import { map, list } from 'react-immutable-proptypes';
// import { bindAll } from 'swipes-core-js/classes/utils';
// import { setupDelegate } from 'react-delegate';
// import SWView from 'SWView';
// import Button from 'Button';
// import Icon from 'Icon';
// import './styles/View.scss';

class View extends PureComponent {
  render() {
    console.log('props view', this.props);
    console.log('props view', this);
    return (
      <div className="className" />
    );
  }
}

export default View

// const { string } = PropTypes;

View.propTypes = {};
