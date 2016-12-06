import React, { Component, PropTypes } from 'react';
import Icon from '../../icons/Icon';

import './styles/nav-bar.scss';

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  renderCrumb(title, index, numberOfCrumbs) {
    let className = 'bread-crumbs__crumb';

    if ((index + 1) === numberOfCrumbs) {
      className += ' bread-crumbs__crumb--last';
    }

    return (
      <div className={className} key={index}>
        <div className="bread-crumbs__title">
          {title}
        </div>
        <div className="bread-crumbs__seperator">
          <Icon svg="ArrowRightIcon" className="bread-crumbs__icon" />
        </div>
      </div>
    );
  }
  renderBreadCrumbs() {
    const { data } = this.props;
    if (!data) {
      return undefined;
    }

    const breadCrumbsHTML = data.map((crumb, i) =>
      this.renderCrumb(crumb.title, i, data.length));

    return (
      <div className="bread-crumbs">
        {breadCrumbsHTML}
      </div>
    );
  }
  renderBackButton() {
    const { data } = this.props;
    if (!data || data.length === 1) {
      return undefined;
    }
    return (
      <div className="nav-bar__button nav-bar__button--back">
        <Icon svg="ArrowLeftIcon" className="nav-bar__icon" />
      </div>
    );
  }
  renderActions() {

  }
  render() {
    return (
      <div className="nav-bar">
        {this.renderBreadCrumbs()}
        {this.renderBackButton()}
        {this.renderActions()}
      </div>
    );
  }
}

export default NavBar;

const { string } = PropTypes;

NavBar.propTypes = {
  // removeThis: string.isRequired,
};
