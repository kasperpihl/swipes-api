import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { setupDelegate } from 'react-delegate';
import SW from './TabBar.swiss';

class TabBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: props.activeTab || 0
    };
    setupDelegate(this, 'tabDidChange');
  }

  render() {
    const { tabs, activeTab, className } = this.props;

    return (
      <SW.Wrapper className={className}>
        {tabs.map((tab, i) => (
          <SW.Item
            active={i === activeTab}
            key={`tab-${i}`}
            onClick={this.tabDidChangeCached(i)}
          >
            {tab}
          </SW.Item>
        ))}
      </SW.Wrapper>
    );
  }
}

export default TabBar;

const { string, arrayOf, number, object } = PropTypes;

TabBar.propTypes = {
  tabs: arrayOf(string),
  activeTab: number,
  delegate: object
};
