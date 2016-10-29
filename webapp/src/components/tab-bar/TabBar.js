import React, { Component, PropTypes } from 'react'
import { bindAll } from '../../classes/utils';
import './styles/tab-bar.scss'
import * as Icons from '../icons'

class TabBar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeTab: props.activeTab || 0
    }
    bindAll(this, ['setActiveTab'])
  }
  componentDidMount() {
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.activeTab != nextProps.activeTab) {
      this.setState({activeTab: nextProps.activeTab})
    }
  }
  callback(index) {
    this.props.onChange(index)
  }
  setActiveTab(e) {
    const newIndex = Number(e.target.getAttribute('data-index'));
    if(newIndex !== this.state.activeTab){
      this.setState({activeTab: newIndex})
      this.callback(newIndex)
    }
  }
  renderIcon(icon, i){
    const Comp = Icons[icon];

    if (Comp) {
      return <Comp className="tab-bar__icon tab-bar__icon--svg" data-index={i}/>;
    }

    return <i className="material-icons tab-bar__icon tab-bar__icon--font" data-index={i}>{icon}</i>
  }
  render() {
    const { data, align } = this.props;
    const { activeTab } = this.state;
    let rootClass = 'tab-bar';

    if (align) {
      rootClass += ' tab-bar--' + align;
    } else {
      rootClass += ' tab-bar--left';
    }

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
            {this.renderIcon(tab.icon, i)}
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
