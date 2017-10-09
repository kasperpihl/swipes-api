import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Measure from 'react-measure';
import { setupDelegate } from 'react-delegate';
import { bindAll, debounce } from 'swipes-core-js/classes/utils';

import './styles/tab-bar';

class TabBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: props.activeTab || 0,
      sliderClips: [],
    };
    this.calculateSliderClips = this.calculateSliderClips.bind(this);
    this.bouncedCalc = debounce(this.calculateSliderClips, 1);
    setupDelegate(this, 'tabDidChange');
  }

  calculateSliderClips() {
    const { tabBar } = this.refs;
    if (tabBar) {
      const { tabs } = this.props;
      const tabBarWidth = tabBar.getBoundingClientRect().width;
      const tabWidths = [];
      const sliderClipsArr = [];

      tabs.forEach((t, i) => {
        const ref = this.refs[`tab-${i}`];
        tabWidths.push(ref.getBoundingClientRect().width);
      });

      tabWidths.reduce((previousValue, currentValue) => {

        sliderClipsArr.push(
          {
            start: previousValue,
            width: currentValue - 30,
          },
        );

        return previousValue + currentValue;
      }, 0);

      this.setState({ sliderClips: sliderClipsArr });
    }
  }
  renderSlider() {
    const { sliderClips } = this.state;
    const { activeTab } = this.props;

    let styles = {
      left: 0,
      width: 0,
    };

    if (sliderClips.length && sliderClips[activeTab]) {
      styles = {
        left: sliderClips[activeTab].start + 'px',
        width: sliderClips[activeTab].width + 'px',
      };
    }

    return (
      <div className="tab-bar__slider" style={styles} />
    );
  }
  render() {
    const { tabs, activeTab } = this.props;
    const rootClass = 'tab-bar';

    const tabsHTML = tabs.map((tab, i) => {
      let tabClass = 'tab-bar__tab';

      if (i === activeTab) {
        tabClass += ' tab-bar__tab--active';
      }

      return (
        <Measure key={`tab-${i}`} onMeasure={this.bouncedCalc}>
          <div
            ref={`tab-${i}`}
            className={tabClass}
            onClick={this.tabDidChangeCached(i)}
          >{tab}</div>
        </Measure>
      );
    });

    return (
      <div ref="tabBar" className={rootClass}>
        {tabsHTML}
        <Measure onMeasure={this.bouncedCalc}>
          {this.renderSlider()}
        </Measure>
      </div>
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
