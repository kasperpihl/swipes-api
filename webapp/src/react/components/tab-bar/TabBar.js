import React, { Component, PropTypes } from 'react';

import Icon from 'Icon';
import { bindAll } from 'classes/utils';

import './styles/tab-bar.scss';

class TabBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: props.activeTab || 0,
      sliderClips: [],
    };
    bindAll(this, ['onChange']);
  }
  componentDidMount() {
    setTimeout(() => {
      this.calculateSliderClips();
    }, 50);
  }
  componentDidUpdate(prevProps) {
    if (this.props.activeTab !== prevProps.activeTab) {
      this.calculateSliderClips();
    }
  }
  onChange(e) {
    const newIndex = Number(e.target.getAttribute('data-index'));

    if (newIndex !== this.props.activeTab) {
      this.callDelegate('tabDidChange', newIndex);
    }
  }
  callDelegate(name) {
    const { delegate } = this.props;

    if (delegate && typeof delegate[name] === 'function') {
      return delegate[name](...[this].concat(Array.prototype.slice.call(arguments, 1)));
    }

    return undefined;
  }
  calculateSliderClips() {
    const { tabBar } = this.refs;
    const { tabs } = this.props;
    const tabBarWidth = tabBar.getBoundingClientRect().width;
    const tabWidths = [];
    const sliderClipsArr = [];

    tabs.forEach((t, i) => {
      const ref = this.refs[`tab-${i}`];
      tabWidths.push(ref.getBoundingClientRect().width);
    });

    tabWidths.reduce((previousValue, currentValue) => {
      console.log(previousValue, currentValue);
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
  renderSlider() {
    const { sliderClips } = this.state;
    const { activeTab } = this.props;

    let styles = {
      WebkitClipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)',
    };

    if (sliderClips.length) {
      styles = {
        WebkitClipPath: `polygon(${sliderClips[activeTab].start}% 0%, ${sliderClips[activeTab].end}% 0%, ${sliderClips[activeTab].end}% 100%, ${sliderClips[activeTab].start}% 100%)`,
      };
    }

    return (
      <div className="tab-bar__slider" style={styles} />
    );
  }
  render() {
    console.log('run render');
    const { tabs, activeTab } = this.props;
    const rootClass = 'tab-bar';

    const tabsHTML = tabs.map((tab, i) => {
      let tabClass = 'tab-bar__tab';

      if (i === activeTab) {
        tabClass += ' tab-bar__tab--active';
      }

      return (
        <div ref={`tab-${i}`} className={tabClass} data-index={i} key={`tab-${i}`} onClick={this.onChange}>{tab}</div>
      );
    });

    return (
      <div ref="tabBar" className={rootClass}>
        {tabsHTML}
        {this.renderSlider()}
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
