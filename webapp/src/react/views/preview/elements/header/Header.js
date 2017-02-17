import React, { Component, PropTypes } from 'react';
import { mapContains } from 'react-immutable-proptypes';
import { setupDelegate } from 'classes/utils';

import './styles/header.scss';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.callDelegate = setupDelegate(props.delegate);
  }
  render() {
    const { data } = this.props;

    return (
      <div className="card-header">
        <div className="card-header__subtitle">{data.get('subtitle')}</div>
        <div className="card-header__title">{data.get('title')}</div>
        <div className="card-header__description">{data.get('description')}</div>
      </div>
    );
  }
}

export default Header;

const { string, object } = PropTypes;

Header.propTypes = {
  data: mapContains({
    subtitle: string,
    title: string,
    description: string,
  }),
  delegate: object,
};
