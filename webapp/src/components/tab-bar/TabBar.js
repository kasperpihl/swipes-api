import React, { Component, PropTypes } from 'react'
import { bindAll } from '../../classes/utils';
import './styles/tab-bar.scss'

class TabBar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeTab: 0
    }
    bindAll(this, ['setActiveTab'])
  }
  componentDidMount() {
  }
  componentWillUpdate(nextProps, nextState) {
    if(nextState.activeTab != this.state.activeTab) {
      this.callback(nextState.activeTab)
    }
  }
  callback(index) {
    this.props.callback(index)
  }
  setActiveTab(e) {
    const newIndex = Number(e.target.getAttribute('data-index'));
    console.log(e.target);
    this.setState({activeTab: newIndex})
  }
  render() {
    const { data } = this.props;
    const { activeTab } = this.state;
    let rootClass = 'tab-bar';

    const tabs = data.map((tab, i) => {
      let tabClass = 'tab-bar__tab';

      if (i === activeTab) {
        tabClass += ' tab-bar__tab--active'
      }

      if (typeof tab === 'string') {
        return (
          <div className={tabClass} data-index={i} key={'tab-'+i} onClick={this.setActiveTab}>{tab}</div>
        )
      } else if (typeof tab === 'object') {

        return (
          <div className={tabClass + ' tab-bar__tab--icon'} data-index={i} key={'tab-'+i} onClick={this.setActiveTab}>
            <i className='material-icons' data-index={i}>{tab.icon}</i>
            <div className='tab-bar__tab__title' data-index={i}>{tab.title}</div>
          </div>
        )
      }
    })

    return (
      <div className={rootClass}>
        {tabs}
      </div>
    )
  }
}

export default TabBar

const { string } = PropTypes;

TabBar.propTypes = {
  // removeThis: string.isRequired
}
