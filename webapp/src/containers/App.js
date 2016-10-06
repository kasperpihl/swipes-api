import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { api, modal } from '../actions'

import Topbar from './Topbar'
import Modal from './Modal'
import Workspace from './Workspace'
import Overlay from './Overlay'
import Toasty from './Toasty'
import DotDragOverlay from './DotDragOverlay'
const {dialog} = nodeRequire('electron').remote

let DevTools = 'div';
if(process.env.NODE_ENV !== 'production'){
  DevTools = require('../DevTools');
}
import PureRenderMixin from 'react-addons-pure-render-mixin';

class App extends Component {
  constructor(props){
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
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
      this.props.loadModal({title: "Find Dropbox folder", data: {message: "This will enable you to open files on your local dropbox folder (experimental)", buttons: ["No", "Yes"]}}, (res) => {
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
    let classes = 'main ';
    if(this.props.mainClasses){
      classes += this.props.mainClasses.toArray().join(' ');
    } 
    return (
      <div className={classes}>
        <Topbar pathname={this.props.location.pathname} />
        <Workspace />
        <Overlay />
        <Modal />
        <Toasty />
        <DotDragOverlay />
        <DevTools />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    mainClasses: state.getIn(['main', 'mainClasses'])
  }
}

const ConnectedApp = connect(mapStateToProps, {
  request: api.request,
  loadModal: modal.load
})(App)
export default ConnectedApp
