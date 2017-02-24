import React, { Component, PropTypes } from 'react';
import Measure from 'react-measure';

import { bindAll, debounce, setupDelegate } from 'classes/utils';

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
    this.callDelegate = setupDelegate(props.delegate, this);
    bindAll(this, ['onChange']);
  }
  onChange(e) {
    const newIndex = Number(e.target.getAttribute('data-index'));
    this.callDelegate('tabDidChange', newIndex);
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
            start: ((previousValue * 100) / tabBarWidth),
            end: ((((previousValue + currentValue) - 30) * 100) / tabBarWidth),
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
      WebkitClipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)',
    };

    if (sliderClips.length && sliderClips[activeTab]) {
      styles = {
        WebkitClipPath: `polygon(${sliderClips[activeTab].start}% 0%, ${sliderClips[activeTab].end}% 0%, ${sliderClips[activeTab].end}% 100%, ${sliderClips[activeTab].start}% 100%)`,
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
          <div ref={`tab-${i}`} className={tabClass} data-index={i} onClick={this.onChange}>{tab}</div>
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
