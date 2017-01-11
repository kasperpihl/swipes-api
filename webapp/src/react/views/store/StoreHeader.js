import React, { Component } from 'react';
import Icon from 'Icon';

import './styles/store-header.scss';

class StoreHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
  }
  render() {
    const rootClass = 'store-header';

    return (
      <div className={rootClass}>
        <div className="store-header__section store-header__section--first">
          <div className="store-header__title">Workflows</div>
          <div className="store-header__search">
            <Icon svg="Find" className="store-header__icon store-header__icon--find" />
          </div>
        </div>

        <div className="store-header__section store-header__section--second">
          <div className="store-header__featured">
            <Icon png="facebookCover" />
            <div className="store-header__featured__title">Run product sprints faster</div>
          </div>
          <div className="store-header__featured">
            <Icon png="airbnbCover" />
            <div className="store-header__featured__title">Get more done in your meetings</div>
          </div>
          <div className="store-header__featured">
            <Icon png="uberCover" />
            <div className="store-header__featured__title">Get a project from A to Z</div>
          </div>
        </div>
      </div>
    );
  }
}

export default StoreHeader;
