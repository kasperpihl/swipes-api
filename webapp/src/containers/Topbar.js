import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { main, modal } from '../actions'
import '../components/topbar/topbar.scss'

import WorkspaceIcon from '../components/global-styles/images/workspace-icon.svg'
var gradient = require('../components/topbar/gradient');

class Topbar extends Component {
  constructor(props) {
    super(props)
    var gradientPos = gradient.getGradientPos();
    this.state = {gradientPos: gradientPos};
    this.gradientStep = this.gradientStep.bind(this);
  }
  componentDidMount() {
    this.gradientStep();
  }
  clickedAdd(){
    if(this.props.isFinding){
      this.props.toggleFind();
    }
    else if(this.props.isFullscreen) {
      this.props.toggleFullscreen();
    }
    else {
      this.props.loadTilesListModal();
    }
  }
  clickedFind(){
    this.props.toggleFind();
  }
  signout() {
    window.location.replace('/');
  }
  gradientStep(){
    var gradientPos = gradient.getGradientPos();
    if(this.state.gradientPos != gradientPos){
      this.setState({gradientPos: gradientPos});
    }
    setTimeout(this.gradientStep, 3000);
  }
  render() {
    var topbarClass = 'sw-topbar';
    var styles = {};
    
    if(this.state.gradientPos) {
      styles.backgroundPosition = this.state.gradientPos + '% 50%';
    }

    if(this.props.isFullscreen) {
      topbarClass += ' fullscreen'
    }
    if(this.props.isFinding){
      topbarClass += ' find';
    }

    return (
      <div className={topbarClass} id="topbar" style={styles}>
        <div className="sw-topbar__content">
          <div className="sw-topbar__info">
            <div className="sw-topbar__info__title">My Workspace</div>
            <i className="material-icons">arrow_drop_down</i>
          </div>
          <div className="sw-topbar__searchbar">
            <input ref="searchInput" placeholder="Search your apps" />
          </div>
          <div className="sw-topbar__actions">
            <div className="sw-topbar__button sw-topbar__button--find" onClick={this.clickedFind.bind(this)}>
              <i className="material-icons">search</i>
            </div>
            <div className="sw-topbar__button sw-topbar__button--add" onClick={this.clickedAdd.bind(this)}>
              <i className="material-icons">add</i>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    isFullscreen: state.main.isFullscreen,
    isFinding: state.main.isFinding
  }
}

const ConnectedTopbar = connect(mapStateToProps, {
  toggleFullscreen: main.toggleFullscreen,
  toggleFind: main.toggleFind,
  loadTilesListModal: modal.loadTilesListModal
})(Topbar)
export default ConnectedTopbar
