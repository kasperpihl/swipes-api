import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { api } from '../actions'

import Topbar from '../components/topbar/Topbar'
import SearchResults from '../components/SearchResults'
import Modal from '../components/Modal'

class App extends Component {
  componentDidMount() {
    this.props.request('rtm.start');
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

function mapStateToProps(state) {
  return {
    hasLoaded: state.main.hasLoaded
  }
}

const ConnectedApp = connect(mapStateToProps, {
  request: api.request
})(App)
export default ConnectedApp