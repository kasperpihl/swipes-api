import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { list } from 'react-immutable-proptypes';
import * as a from 'actions';
import { setupCachedCallback, setupDelegate } from 'classes/utils';

import './styles/header-title.scss';

class HOCHeaderTitle extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.onClickCached = setupCachedCallback(this.onClick, this);
    this.callDelegate = setupDelegate(props.delegate);
  }
  componentDidMount() {
    const { input } = this.refs;
    this.callDelegate('navbarLoadedInput', input);
  }
  renderInputTitle(placeholder) {
    const {
      history, // eslint-disable-line
      target, // eslint-disable-line
      pop, // eslint-disable-line
      children, // eslint-disable-line
      delegate, // eslint-disable-line
      ...rest
    } = this.props;

    return (
      <input
        type="text"
        ref="input"
        {...rest}
        placeholder={placeholder}
        className="header-title__input"
        key="header-input"
      />
    );
  }
  renderTitle(crumb) {
    const { title, subtitle } = this.props;
    const titleText = title || crumb.get('title');

    return (
      <div className="header-title__title" key="header-title">
        {titleText}
        <div className="header-title__subtitle">{subtitle}</div>
      </div>
    );
  }
  renderContent() {
    const { history, title } = this.props;
    if (!history && title) {
      return this.renderTitle();
    }

    if (!history) {
      return undefined;
    }

    return history.map((crumb, i) => {
      const isLast = (i + 1) === history.size;

      if (isLast && !crumb.get('placeholder')) {
        return this.renderTitle(crumb, i);
      } else if (isLast && crumb.get('placeholder')) {
        return this.renderInputTitle(crumb.get('placeholder'));
      }

      return undefined;
    });
  }
  render() {
    const { children } = this.props;

    return (
      <div className="header-title">
        {this.renderContent()}
        <div className="header-title__actions">
          {children}
        </div>
      </div>
    );
  }
}

const { object, func, string, array, oneOfType } = PropTypes;

HOCHeaderTitle.propTypes = {
  target: string,
  title: string,
  subtitle: string,
  history: list,
  delegate: object,
  children: oneOfType([object, array]),
  pop: func,
};

function mapStateToProps(state, ownProps) {
  return {
    history: state.getIn(['navigation', ownProps.target]),
  };
}


export default connect(mapStateToProps, {
  pop: a.navigation.pop,
})(HOCHeaderTitle);
