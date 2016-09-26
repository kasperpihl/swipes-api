import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { api, modal } from '../actions'

import Topbar from './Topbar'
import Find from './Find'
import Modal from './Modal'
import Overlay from './Overlay'
import DotDragOverlay from './DotDragOverlay'
const {dialog} = nodeRequire('electron').remote

let DevTools = 'div';
if(process.env.NODE_ENV !== 'production'){
  DevTools = require('../DevTools');
}

class App extends Component {
  componentDidMount() {
    this.props.request('rtm.start');
    this.checkForDropboxFolder();

    // Massive hack to not be able to drop files into swipes so it wouldn't redirect

    document.addEventListener('dragover', (e) => {
      e.preventDefault()
      return false;
    })

    document.addEventListener('drop', (e) => {
      e.preventDefault()
      return false;
    })
  }
  checkForDropboxFolder(){
    if(!localStorage.getItem('dropbox-folder') && !localStorage.getItem('dropbox-did-ask')){
      this.props.loadModal({title: "Find Dropbox folder", message: "This will enable you to open files on your local dropbox folder (experimental)", buttons: ["No", "Yes"]}, (res) => {
        if(res && res.button){
          var folder = dialog.showOpenDialog({ properties: ['openDirectory']});
          if(folder){
            localStorage.setItem('dropbox-folder', folder);
          }
        }
        localStorage.setItem('dropbox-did-ask', true)
      })
      //
    }
  }
  render() {
    let classes = 'main ' + this.props.mainClasses.join(' ');
    return (
      <div className={classes}>
        <Topbar pathname={this.props.location.pathname} />
        <div className="active-app">
          {this.props.children}
        </div>
        <Find />
        <Overlay />
        <Modal />

        <DotDragOverlay />
        <DevTools />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    mainClasses: state.main.mainClasses || []
  }
}

const ConnectedApp = connect(mapStateToProps, {
  request: api.request,
  loadModal: modal.loadModal
})(App)
export default ConnectedApp
