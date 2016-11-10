import React, { Component, PropTypes } from 'react'
import * as Icons from '../icons'
import Checkbox from '../swipes-ui/Checkbox'
import './styles/checklist.scss'

class Checklist extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount() {
  }
  renderIcon(icon){
    const Comp = Icons[icon];

    if (Comp) {
      return <Comp className="checklist__icon checklist__icon--svg"/>;
    }

    return <i className="material-icons checklist__icon checklist__icon--font">{icon}</i>
  }
  renderHeader() {
    return (
      <div className="checklist__header">
        {this.renderIcon('CheckmarkIcon')}
        <div className="checklist__title">Checklist</div>
        <div className="checklist__description">Things to improve</div>
      </div>
    )
  }
  render() {
    return (
      <div className="checklist">
        {this.renderHeader()}
        <Checkbox label="Improve target audience" checked={true}/>
        <Checkbox label="Minimize on features"/>
        <Checkbox label="Prepare 2 more use cases"/>
      </div>
    )
  }
}

export default Checklist

const { string } = PropTypes;

Checklist.propTypes = {}
