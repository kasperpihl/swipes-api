import React, { Component, PropTypes } from 'react'
import ProgressBar from '../swipes-ui/ProgressBar'

import * as Icons from '../icons'

import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup'

import { bindAll } from '../../classes/utils';

import './styles/nav-bar.scss'

class NavBar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeTab: 0,
      sliderClips: []
    }
    bindAll(this, ['setActiveTab'])
  }
  callDelegate(name){
    const { delegate } = this.props;
    if(delegate && typeof delegate[name] === "function"){
      return delegate[name].apply(delegate, [this].concat(Array.prototype.slice.call(arguments, 1)));
    }
  }
  componentDidMount() {
    setTimeout( () => {
      this.calculateSliderClips()
    }, 10)
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.activeTab != nextProps.activeTab) {
      this.setState({activeTab: nextProps.activeTab});
    }
  }
  calculateSliderClips() {
    const { activeTab, sliderClips } = this.state;
    const { data } = this.props;
    const { tabBar } = this.refs;
		const tabBarWidth = tabBar.getBoundingClientRect().width;
    const tabWidths = [];
    const sliderClipsArr = [];

    for (var ref in this.refs) {
      if (ref.startsWith('tab-')) {
        tabWidths.push(this.refs[ref].getBoundingClientRect().width)
      }
    }

    tabWidths.reduce( (previousValue, currentValue, index) => {
      const calcMargin = 30 * index;

      sliderClipsArr.push(
        {
          start: (previousValue) * 100 / tabBarWidth,
          end: (previousValue + currentValue) * 100 / tabBarWidth
        }
      );

      return previousValue + currentValue
    }, 0);

    sliderClips.push(...sliderClipsArr)

    this.setState({sliderClips: sliderClips})
  }
  callback(index) {
    this.callDelegate('navTabDidChange', index);
  }
  setActiveTab(e) {
    const newIndex = Number(e.target.getAttribute('data-index'));

    if (newIndex !== this.state.activeTab) {
      this.setState({activeTab: newIndex});
      this.callback(newIndex);
    }
  }
  renderIcon(icon, i){
    const Comp = Icons[icon];

    if (Comp) {
      return <Comp className="sw-nav-bar__icon sw-nav-bar__icon--svg" data-index={i}/>;
    }
  }
  renderSlider() {
    const { activeTab, sliderClips } = this.state;
    const { title, steps, stepIndex } = this.props;

    let styles = {
      WebkitClipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)'
    };

    if (sliderClips.length) {
      styles = {
        WebkitClipPath: `polygon(${sliderClips[activeTab].start}% 0%, ${sliderClips[activeTab].end}% 0%, ${sliderClips[activeTab].end}% 100%, ${sliderClips[activeTab].start}% 100%)`
      }
    }

    return (
      <div className="sw-nav-bar__slider" style={styles}></div>
    )
  }
  render() {
    const { tabs, title, steps } = this.props;
    const { activeTab} = this.state;
    let rootClass = 'sw-nav-bar';

    const tabsHTML = tabs.map((tab, i) => {
      let tabClass = 'sw-nav-bar__tab';

      if (i === activeTab) {
        tabClass += ' sw-nav-bar__tab--active'
      }

      return (
        <div ref={"tab-" + i} className={tabClass} data-index={i} key={'tab-'+i} onClick={this.setActiveTab}>{tab}</div>
      )
    })

    return (
      <div ref="tabBar" className={rootClass}>
        {tabsHTML}
        {this.renderSlider()}
      </div>
    )
  }
}

export default NavBar

const { string, oneOfType, func, arrayOf, shape, bool, number } = PropTypes;

NavBar.propTypes = {
  onChange: func,
  tabs: arrayOf(
    string
  ),
  title: string,
  steps: arrayOf(
    shape({
      title: string,
      completed: bool
    })
  ),
  stepIndex: number
}
