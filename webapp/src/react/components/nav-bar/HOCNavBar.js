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
      delegate,
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

        <div className="bread-crumbs__bottom-border" />
      </div>
    );
  }
  renderCrumb(crumb, i, numberOfCrumbs) {
    const title = crumb.get('title');
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
    if (isLast && crumb.get('placeholder')) {
      renderedCrumb = this.renderInputCrumb(crumb.get('placeholder'));
    }

    return (
      <div className={className} key={j} ref="container" onClick={this.onClickCached(i)}>
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
      this.renderCrumb(crumb, i, history.size));

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
