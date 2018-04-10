import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { styleElement } from 'react-swiss';
import { setupDelegate } from 'react-delegate';

import styles from './TabBar.swiss';

const TabWrapper = styleElement('div', styles, 'TabWrapper');
const TabItem = styleElement('div', styles, 'TabItem');

class TabBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: props.activeTab || 0,
    };
    setupDelegate(this, 'tabDidChange');
  }

  render() {
    const { tabs, activeTab } = this.props;

    return (
      <TabWrapper>
        {tabs.map((tab, i) => (
          <TabItem
            active={i === activeTab}
            key={`tab-${i}`}
            onClick={this.tabDidChangeCached(i)}>
            {tab}
          </TabItem>  
        ))}
      </TabWrapper>
    );
  }
}

export default TabBar;

const { string, arrayOf, number, object } = PropTypes;

TabBar.propTypes = {
  tabs: arrayOf(
    string,
  ),
  activeTab: number,
  delegate: object,
};
