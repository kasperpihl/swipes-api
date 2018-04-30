import React, { Component } from 'react';
import { styleElement } from 'react-swiss';
import { connect } from 'react-redux';
import Icon from 'Icon';
import { setupCachedCallback } from 'react-delegate';
import * as navigationActions from 'src/redux/navigation/navigationActions';

import styles from './BreadCrumbs.swiss';

const Wrapper = styleElement('div', styles.Wrapper);
const Crumb = styleElement('div', styles.Crumb);
const Title = styleElement('div', styles.Title);
const Seperator = styleElement('div', styles.Seperator);
const CrumbIcon = styleElement(Icon, styles.Icon);

class HOCBreadCrumbs extends Component {
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
        <Crumb
          key={i} 
          className="crumb" 
          disableClick={disableClick}
          onClick={this.onClickCached(i)}>
          {(i > 0) && (
          <Seperator>
            <CrumbIcon disableClick={disableClick} icon="Breadcrumb" />
          </Seperator>
          )}
          <Title disableClick={disableClick}>{crumb.get('title')}</Title>
        </Crumb>
      )
    }).toArray().filter(v => !!v);
  }
  render() {
    return (
      <Wrapper>
        {this.renderBreadCrumbs()}
      </Wrapper>
    );
  }
}

export default connect((state, props) => ({
  history: state.getIn(['navigation', props.target, 'stack']),
}), {
  pop: navigationActions.pop,
})(HOCBreadCrumbs);
