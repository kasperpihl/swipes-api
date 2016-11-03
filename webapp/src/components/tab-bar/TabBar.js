import React, { Component, PropTypes } from 'react'
import { bindAll } from '../../classes/utils';
import './styles/tab-bar.scss'
import * as Icons from '../icons'

class TabBar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeTab: 1,
      clips: []
    }
    bindAll(this, ['setActiveTab'])
  }
  componentDidMount() {
    setTimeout( () => {
      this.doMath()
    }, 10)
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.activeTab != nextProps.activeTab) {
      this.setState({activeTab: nextProps.activeTab});
    }
  }
  callback(index) {
    this.props.onChange(index)
  }
  setActiveTab(e) {
    const newIndex = Number(e.target.getAttribute('data-index'));
    if(newIndex !== this.state.activeTab){
      this.setState({activeTab: newIndex})
      this.callback(newIndex);
    }
  }
  renderIcon(icon, i){
    const Comp = Icons[icon];

    if (Comp) {
      return <Comp className="tab-bar__icon tab-bar__icon--svg" data-index={i}/>;
    }

    return <i className="material-icons tab-bar__icon tab-bar__icon--font" data-index={i}>{icon}</i>
  }
  doMath() {
    const { activeTab, clips } = this.state;
    const { data } = this.props;
    const { tabBar } = this.refs;
		const tabBarWidth = tabBar.getBoundingClientRect().width;
    const tabWidths = [];
    const sliderClips = [];

    for (var ref in this.refs) {
      if (ref.startsWith('tab-')) {
        tabWidths.push(this.refs[ref].getBoundingClientRect().width)
      }
    }

    tabWidths.reduce( (previousValue, currentValue) => {
      sliderClips.push({start: previousValue * 100 / tabBarWidth, end: (previousValue + currentValue) * 100 / tabBarWidth});

      return previousValue + currentValue
    }, 0);

    clips.push(...sliderClips)

    this.setState({clips: clips})
  }
  render() {
    const { data, align } = this.props;
    const { activeTab } = this.state;
    let rootClass = 'tab-bar';
    let styles = {
      WebkitClipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)'
    };

    if (align) {
      rootClass += ' tab-bar--' + align;
    } else {
      rootClass += ' tab-bar--center';
    }

    const tabs = data.map((tab, i) => {
      let tabClass = 'tab-bar__tab';

      if (i === activeTab) {
        tabClass += ' tab-bar__tab--active'
      }

      if (typeof tab === 'string') {

        return (
          <div ref={"tab-" + i} className={tabClass} data-index={i} key={'tab-'+i} onClick={this.setActiveTab}>{tab}</div>
        )
      } else if (typeof tab === 'object') {

        return (
          <div className={tabClass + ' tab-bar__tab--icon'} data-index={i} key={'tab-'+i} onClick={this.setActiveTab}>
            {this.renderIcon(tab.icon, i)}
            <div className='tab-bar__tab__title' data-index={i}>{tab.title}</div>
          </div>
        )
      }
    })

    if (this.state.clips.length) {
      styles = {
        WebkitClipPath: 'polygon(' + this.state.clips[activeTab].start + '% 0%, ' + this.state.clips[activeTab].end + '% 0%, ' + this.state.clips[activeTab].end + '% 100%, ' + this.state.clips[activeTab].start + '% 100%)'
      }
    }

    return (
      <div ref="tabBar" className={rootClass}>
        {tabs}
        <div className="tab-bar__slider" style={styles}></div>
      </div>
    )
  }
}

export default TabBar

const { string, oneOfType, func, arrayOf, shape } = PropTypes;

TabBar.propTypes = {
  onChange: func,
  data: arrayOf(
    oneOfType([
      string,
      shape({
        title: string,
        icon: string
      })
    ])
  )
}
