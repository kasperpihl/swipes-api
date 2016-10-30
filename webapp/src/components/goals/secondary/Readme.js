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
        <div className="sw-read-me__title">Checklist</div>
        <div className="sw-read-me__description">Things to improve</div>
      </div>
    )
  }
  render() {
    return (
      <div className="sw-read-me">
        {this.renderHeader()}
        <div className="sw-read-me__content">
          Swipes helps companies work fast even as they grow. You can create simple workflows for meetings, projects or onboardings.
          <br/>
          <br/>
          Share them with your team. So they can execute them across Slack, Dropbox, Evernote, Gmail etc. All from a single place.
        </div>
      </div>
    )
  }
}

export default Readme

const { string } = PropTypes;

Readme.propTypes = {}
