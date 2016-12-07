import React, { Component, PropTypes } from 'react';
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup';
import Icon from 'Icon';
import { nearestAttribute } from 'classes/utils';

import './styles/nav-bar.scss';

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.clickedBack = this.clickedBack.bind(this);
    this.clickedCrumb = this.clickedCrumb.bind(this);
  }
  callDelegate(name) {
    const { delegate } = this.props;
    if (delegate && typeof delegate[name] === 'function') {
      return delegate[name](...[this].concat(Array.prototype.slice.call(arguments, 1)));
    }
    return undefined;
  }
  clickedBack() {
    this.callDelegate('navbarClickedBack');
  }
  clickedCrumb(e) {
    const i = parseInt(nearestAttribute(e.target, 'data-index'), 10);
    this.callDelegate('navbarClickedCrumb', i);
  }
  renderCrumb(title, i, numberOfCrumbs) {
    let className = 'bread-crumbs__crumb';
    let j = i;

    if ((i + 1) === numberOfCrumbs) {
      className += ' bread-crumbs__crumb--last';
      j = `${j}last`;
    }

    return (
      <div className={className} key={j} onClick={this.clickedCrumb} data-index={i}>
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
    const { history } = this.props;
    if (!history) {
      return undefined;
    }

    const breadCrumbsHTML = history.map((crumb, i) =>
      this.renderCrumb(crumb.title, i, history.length));

    return (
      <ReactCSSTransitionGroup
        transitionName="breadCrumbsTransition"
        component="div"
        className="bread-crumbs"
        transitionEnterTimeout={400}
        transitionLeaveTimeout={400}
      >
        {breadCrumbsHTML}
      </ReactCSSTransitionGroup>
    );
  }
  renderBackButton() {
    return undefined;
    /* const { history } = this.props;
    if (!history || history.length === 1) {
      return undefined;
    }
    return (
      <div className="nav-bar__button nav-bar__button--back" onClick={this.clickedBack}>
        <Icon svg="ArrowLeftIcon" className="nav-bar__icon" />
      </div>
    );*/
  }
  renderActions() {

  }
  render() {
    return (
      <div className="nav-bar">
        {this.renderBreadCrumbs()}
        {this.renderBackButton()}
        {this.props.children}
      </div>
    );
  }
}

export default NavBar;

const { array, object } = PropTypes;

NavBar.propTypes = {
  history: array,
  delegate: object,
  children: object,
};
