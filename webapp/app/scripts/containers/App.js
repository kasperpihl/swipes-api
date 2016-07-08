import React, { Component, PropTypes } from 'react'

import Topbar from '../components/topbar/Topbar'
import SearchResults from '../components/SearchResults'
import Modal from '../components/Modal'

export default class App extends Component {
  componentDidMount() {
    amplitude.logEvent('Session - Opened App');
    mixpanel.track('Opened App');
  }
  render() {
    return (
      <div className="main">
        <Topbar />
        <div className="active-app">
          {this.props.children}
        </div>
        <SearchResults />
        <Modal />
      </div>
    );
  }
}
