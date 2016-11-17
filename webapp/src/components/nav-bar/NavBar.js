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
    bindAll(this, ['setActiveTab', 'pressedBack', 'progressBarChange'])
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
  progressBarChange(i){
    this.callDelegate('navProgressChange', i);
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
  pressedBack(){
    this.callDelegate('navPressedBack');
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

  renderTitle() {
    const { title, steps, stepIndex } = this.props;

    if (!title) {
      return
    }

    return (
      <div className="sw-nav-bar__main-title">
        <div className="sw-nav-bar__btn" onClick={this.pressedBack}>
          {this.renderIcon('ArrowLeftIcon')}
        </div>
        {title}
      </div>
    )
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

    if (title) {
      styles = {
        WebkitClipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)'
      }
    }

    if (steps && stepIndex > -1) {
      const activeLength = 100 - (100 / steps.length * stepIndex);

      styles = {
        WebkitClipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)',
        backgroundPosition: `${activeLength}% 0`
      }
    }

    return (
      <div className="sw-nav-bar__slider" style={styles}></div>
    )
  }

  renderProgressbar() {
    const { steps, stepIndex, currentStepIndex } = this.props;

    if (!steps) {
      return;
    }

    return <ProgressBar steps={steps} currentStepIndex={currentStepIndex} index={stepIndex} onChange={this.progressBarChange} />
  }
  render() {
    const { tabs, title, steps } = this.props;
    const { activeTab} = this.state;
    let rootClass = 'sw-nav-bar';

    if (title) {
      rootClass += ' sw-nav-bar--title-view'
    }

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
        <ReactCSSTransitionGroup
          transitionName="titleTransition"
          component="div"
          className="sw-nav-bar__titleTransition"
          transitionEnterTimeout={0}
          transitionLeaveTimeout={400}>
          {this.renderTitle()}
        </ReactCSSTransitionGroup>
          {this.renderActions()}
        {this.renderSlider()}
        <ReactCSSTransitionGroup
          transitionName="progressBarTransition"
          component="div"
          className="sw-nav-bar__progressbar"
          transitionEnterTimeout={0}
          transitionLeaveTimeout={400}>
          {this.renderProgressbar()}
        </ReactCSSTransitionGroup>
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
