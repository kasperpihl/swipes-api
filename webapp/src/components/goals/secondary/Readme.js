import React, { Component, PropTypes } from 'react'
import * as Icons from '../../icons'
import '../styles/readme.scss'

class Readme extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount() {
  }
  renderIcon(icon){
    const Comp = Icons[icon];

    if (Comp) {
      return <Comp className="sw-read-me__icon sw-read-me__icon--svg"/>;
    }

    return <i className="material-icons sw-read-me__icon sw-read-me__icon--font">{icon}</i>
  }
  renderHeader() {

    return (
      <div className="sw-read-me__header">
        {this.renderIcon('ListIcon')}
        <div className="sw-read-me__title">Readme</div>
        <div className="sw-read-me__description">Guidance</div>
      </div>
    )
  }
  render() {
    return (
      <div className="sw-read-me">
        {this.renderHeader()}
        <div className="sw-read-me__content">
          How to define clear specs:
          <br/>
          <br/>
          1. Listen to each other
          <br/>
          2. Respect your teammates' opinion
          <br/>
          3. Smile and be happy
          <br/>
          4. Stop reading and just do it!
        </div>
      </div>
    )
  }
}

export default Readme

const { string } = PropTypes;

Readme.propTypes = {}
