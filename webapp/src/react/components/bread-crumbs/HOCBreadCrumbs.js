import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setupCachedCallback } from 'react-delegate';
import * as navigationActions from 'src/redux/navigation/navigationActions';
import SW from './BreadCrumbs.swiss';


@connect((state, props) => ({
  history: state.getIn(['navigation', props.target, 'stack']),
}), {
  pop: navigationActions.pop,
})
export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.onClickCached = setupCachedCallback(this.onClick, this);
  }
  onClick(i) {
    const { target, pop } = this.props;
    pop(target, i);
  }
  renderBreadCrumbs() {
    const { history } = this.props;

    if (!history) {
      return undefined;
    }

    return history.map((crumb, i) => {
      if(history.size === 1 && !crumb.get('showTitleInCrumb') || history.size > 1 && i === (history.size - 1)) {
        return null;
      }
      const disableClick = history.size === (i + 1);
      return (
        <SW.Crumb
          key={i}
          className="crumb"
          disableClick={disableClick}
          onClick={this.onClickCached(i)}>
          {(i > 0) && (
          <SW.Seperator>
            <SW.CrumbIcon disableClick={disableClick} icon="Breadcrumb" />
          </SW.Seperator>
          )}
          <SW.Title disableClick={disableClick}>{crumb.get('title')}</SW.Title>
        </SW.Crumb>
      )
    }).toArray().filter(v => !!v);
  }
  render() {
    return (
      <SW.Wrapper>
        {this.renderBreadCrumbs()}
      </SW.Wrapper>
    );
  }
}
