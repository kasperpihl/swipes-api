import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup';
import { list } from 'react-immutable-proptypes';
import Icon from 'Icon';
import * as a from 'actions';
import { setupCachedCallback, setupDelegate } from 'classes/utils';

import './styles/nav-bar.scss';

class HOCNavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.onClickCached = setupCachedCallback(this.onClick, this);
    this.callDelegate = setupDelegate(props.delegate);
  }

  onClick(i) {
    const { target, popTo } = this.props;
    popTo(target, i);
  }
  componentDidMount() {
    const { input } = this.refs;
    this.callDelegate('navbarLoadedInput', input);
  }
  renderInputCrumb(placeholder) {
    const {
      history, // eslint-disable-line
      target, // eslint-disable-line
      popTo, // eslint-disable-line
      children, // eslint-disable-line
      delegate, // eslint-disable-line
      ...rest
    } = this.props;

    return (
      <div className="bread-crumbs__title" ref="title">
        <input
          ref="input"
          {...rest}
          type="text"
          placeholder={placeholder}
        />
      </div>
    );
  }
  renderCrumb(crumb, i) {
    const title = crumb.get('title');

    return (
      <div className="bread-crumbs__crumb" key={i} ref="container" onClick={this.onClickCached(i)}>
        <div className="bread-crumbs__title">
          {title}
        </div>
        <div className="bread-crumbs__seperator">
          <Icon svg="ArrowRightLine" className="bread-crumbs__icon" />
        </div>
      </div>
    );
  }
  renderLastCrumb(crumb, i) {
    const title = crumb.get('title');

    return (
      <div
        className="bread-crumbs__crumb bread-crumbs__crumb--last"
        key={`last-crumb-${i}`}
      >
        <div className="bread-crumbs__title">
          {title}
        </div>
      </div>
    );
  }
  renderBreadCrumbs() {
    const { history } = this.props;

    if (!history) {
      return undefined;
    }

    const breadCrumbsHTML = [];
    const lastBreadCrumbHTML = [];

    history.forEach((crumb, i) => {
      const isLast = (i + 1) === history.size;

      if ((i + 1) > history.size) {
        breadCrumbsHTML.push(this.renderCrumb(crumb, i));
      }

      if (isLast && !crumb.get('placeholder')) {
        lastBreadCrumbHTML.push(this.renderLastCrumb(crumb, i));
      }

      if (isLast && crumb.get('placeholder')) {
        lastBreadCrumbHTML.push(this.renderLastCrumb(crumb.get('placeholder')));
      }
    });

    return (
      <div className="bread-crumbs">
        <div className="bread-crumbs__history">{breadCrumbsHTML}</div>
        <div className="bread-crumbs__title">{lastBreadCrumbHTML}</div>
      </div>
    );
  }
  render() {
    return (
      <div className="nav-bar">
        {this.renderBreadCrumbs()}
        <div className="nav-bar__actions">
          {this.props.children}
        </div>
      </div>
    );
  }
}

const { object, func, string, array, oneOfType } = PropTypes;

HOCNavBar.propTypes = {
  target: string.isRequired,
  history: list,
  delegate: object,
  children: oneOfType([object, array]),
  popTo: func,
};

function mapStateToProps(state, ownProps) {
  const navId = state.getIn(['navigation', ownProps.target, 'id']);
  const history = state.getIn(['navigation', ownProps.target, 'history', navId]);
  return {
    history,
  };
}


export default connect(mapStateToProps, {
  popTo: a.navigation.popTo,
})(HOCNavBar);
