import React, { Component, PropTypes } from 'react';
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup';
import Icon from 'Icon';
import { nearestAttribute, setupDelegate, bindAll } from 'classes/utils';

import './styles/nav-bar.scss';

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    bindAll(this, ['onInputKeyDown', 'onInputKeyUp', 'onInputChange', 'clickedCrumb']);
    this.callDelegate = setupDelegate(props.delegate);
  }

  onInputKeyDown(e) {
    this.callDelegate('navbarInputKeyDown', e);
  }
  onInputKeyUp(e) {
    this.callDelegate('navbarInputKeyUp', e);
  }
  onInputChange(e) {
    this.callDelegate('navbarInputChange', e.target.value);
  }
  clickedCrumb(e) {
    const i = parseInt(nearestAttribute(e.target, 'data-index'), 10);
    this.callDelegate('navbarClickedCrumb', i);
  }
  renderInputCrumb(placeholder) {
    return (
      <div className="bread-crumbs__title">
        <input
          id="navbar-input"
          onKeyDown={this.onInputKeyDown}
          onKeyUp={this.onInputKeyUp}
          onChange={this.onInputChange}
          type="text"
          placeholder={placeholder}
        />

        <div className="bread-crumbs__bottom-border" />
      </div>
    );
  }
  renderCrumb(crumb, i, numberOfCrumbs) {
    const title = crumb.title;
    let className = 'bread-crumbs__crumb';
    let j = i;
    const isLast = (i + 1) === numberOfCrumbs;
    if (isLast) {
      className += ' bread-crumbs__crumb--last';
      j = `${j}last`;
    }
    let renderedCrumb = (
      <div className="bread-crumbs__title">
        {title}
      </div>
    );
    if (isLast && crumb.placeholder) {
      renderedCrumb = this.renderInputCrumb(crumb.placeholder);
    }

    return (
      <div className={className} key={j} onClick={this.clickedCrumb} data-index={i}>
        {renderedCrumb}
        <div className="bread-crumbs__seperator">
          <Icon svg="ArrowRightLine" className="bread-crumbs__icon" />
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
      this.renderCrumb(crumb, i, history.length));

    return (
      <ReactCSSTransitionGroup
        transitionName="breadCrumbsTransition"
        component="div"
        className="bread-crumbs"
        transitionEnterTimeout={200}
        transitionLeaveTimeout={200}
      >
        {breadCrumbsHTML}
      </ReactCSSTransitionGroup>
    );
  }
  render() {
    return (
      <div className="nav-bar">
        {this.renderBreadCrumbs()}
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
