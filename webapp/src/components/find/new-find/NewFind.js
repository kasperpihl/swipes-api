import React, { Component, PropTypes } from 'react'
import TabBar from '../../tab-bar/TabBar'
import './new-find.scss'

class NewFind extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentIndex: 0
    }
  }
  componentDidMount() {
  }
  renderSearchField() {

    return <input type="text" className="find__input" placeholder="Search"/>
  }
  onChange(res) {
    console.log(res);
  }
  renderTabs(tabs) {

    return (
      <div className="find__tabs">
        <TabBar data={tabs} onChange={this.onChange} align="left"/>
      </div>
    )
  }
  renderContent() {

  }
  render() {
    const { tabs } = this.props.data;
    let rootClass = 'find';

    return (
      <div className={rootClass}>
        {this.renderSearchField()}
        {this.renderTabs(tabs)}
        {this.renderContent()}
      </div>
    )
  }
}

export default NewFind

const { string } = PropTypes;

NewFind.propTypes = {
  // removeThis: string.isRequired
}
