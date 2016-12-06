import React, { Component, PropTypes } from 'react';

import Icon from 'Icon';
import { bindAll } from 'classes/utils';

import './styles/tab-bar.scss';

class TabBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 0,
      sliderClips: [],
    };
    bindAll(this, ['setActiveTab']);
  }
  componentDidMount() {
    setTimeout(() => {
      this.calculateSliderClips();
    }, 10);
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.activeTab !== nextProps.activeTab) {
      this.setState({ activeTab: nextProps.activeTab });
    }
  }
  setActiveTab(e) {
    const newIndex = Number(e.target.getAttribute('data-index'));

    if (newIndex !== this.state.activeTab) {
      this.setState({ activeTab: newIndex });
      this.callback(newIndex);
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
    const { sliderClips } = this.state;
    const { tabBar } = this.refs;
    const tabBarWidth = tabBar.getBoundingClientRect().width;
    const tabWidths = [];
    const sliderClipsArr = [];

    const keys = Object.keys(this.refs);

    keys.forEach((key) => {
      const ref = this.refs[key];
      if (key.startsWith('tab-')) {
        tabWidths.push(ref.getBoundingClientRect().width);
      }
    });

    tabWidths.reduce((previousValue, currentValue) => {
      sliderClipsArr.push(
        {
          start: ((previousValue * 100) / tabBarWidth),
          end: (((previousValue + currentValue) * 100) / tabBarWidth),
        },
      );

      return previousValue + currentValue;
    }, 0);

    sliderClips.push(...sliderClipsArr);

    this.setState({ sliderClips });
  }
  callback(index) {
    this.callDelegate('navTabDidChange', index);
  }
  renderIcon(icon, i) {
    return <Icon svg={icon} className="tab-bar__icon tab-bar__icon--svg" data-index={i} />;
  }
  renderSlider() {
    const { activeTab, sliderClips } = this.state;

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
    const { tabs } = this.props;
    const { activeTab } = this.state;
    const rootClass = 'tab-bar';

    const tabsHTML = tabs.map((tab, i) => {
      let tabClass = 'tab-bar__tab';

      if (i === activeTab) {
        tabClass += ' tab-bar__tab--active';
      }

      return (
        <div ref={`tab-${i}`} className={tabClass} data-index={i} key={`tab-${i}`} onClick={this.setActiveTab}>{tab}</div>
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
