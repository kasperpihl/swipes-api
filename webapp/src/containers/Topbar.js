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
    if(this.props.isSearching){
      this.props.toggleSearching();
    }
    else if(this.props.isFullscreen) {
      this.props.toggleFullscreen();
    }
    else {
      this.props.loadTilesListModal();
    }
  }
  clickedSearch(){
    this.props.toggleSearching();
  }
  signout() {
  }
  onClickWorkspace(){
    this.props.logout();
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
    if(this.props.isSearching){
      topbarClass += ' search';
    }

    return (
      <div className={topbarClass} id="topbar" style={styles}>
        <div className="sw-topbar__content">
          <div className="sw-topbar__info">
            <div className="sw-topbar__info__title" onClick={this.onClickWorkspace.bind(this)}>My Workspace2</div>
            <i className="material-icons">arrow_drop_down</i>
          </div>
          <div className="sw-topbar__searchbar">
            <input ref="searchInput" placeholder="Search your apps" />
          </div>
          <div className="sw-topbar__actions">
            <div className="sw-topbar__button sw-topbar__button--search" onClick={this.clickedSearch.bind(this)}>
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
    isSearching: state.main.isSearching
  }
}

const ConnectedTopbar = connect(mapStateToProps, {
  logout: main.logout,
  toggleFullscreen: main.toggleFullscreen,
  toggleSearching: main.toggleSearching,
  loadTilesListModal: modal.loadTilesListModal
})(Topbar)
export default ConnectedTopbar
