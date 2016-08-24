import React, { Component, PropTypes } from 'react'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import { main, modal } from '../actions'
import { bindAll } from '../classes/utils'
import '../components/topbar/topbar.scss'
import DropdownMenu from '../components/swipes-ui/DropdownMenu'

import WorkspaceIcon from '../components/global-styles/images/workspace-icon.svg'
var gradient = require('../components/topbar/gradient');

class Topbar extends Component {
  constructor(props) {
    super(props)
    var gradientPos = gradient.getGradientPos();
    this.state = {gradientPos: gradientPos};
    bindAll(this, ['gradientStep', 'onKeyDown', 'onKeyUp', 'onChangeMenu']);
  }
  componentDidMount() {
    this.gradientStep();
  }
  componentDidUpdate(){
    if(this.props.isFinding){
      this.refs.searchInput.focus()
    }
  }
  onKeyDown(e){
    if(e.keyCode === 13) {
      e.preventDefault();
    }
  }
  onKeyUp(e){
    const input = this.refs.searchInput;

    if (e.keyCode === 13) {
      const searchQuery = input.value;
      if(searchQuery !== this.props.searchQuery){
        this.props.search(searchQuery);
      }
    }
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
  }
  onClickWorkspace(){
    
  }
  onChangeMenu(id){
    if(id === 'workspace'){
      browserHistory.push('/');
    }
    if(id === 'services'){
      browserHistory.push('/' + id);
    }
    if(id === 'logout'){
      this.props.logout();
      window.location.replace('/');
    }

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

    // dummy data for DropdownMenu

    let selectedId = 'workspace'
    const { pathname } = this.props;
    const dropdownStructure = [
      { title: 'Workspace', id: 'workspace' },
      { title: 'Services', id: 'services' },
      { title: 'Log out', id: 'logout' }
    ];
    if(pathname === '/services'){
      selectedId = 'services';
    }

    return (
      <div className={topbarClass} id="topbar" style={styles}>
        <div className="sw-topbar__content">
          <div className="sw-topbar__info">
            <DropdownMenu selectedId={selectedId} data={dropdownStructure} onChange={this.onChangeMenu}/>
          </div>
          <div className="sw-topbar__searchbar">
            <input onKeyUp={this.onKeyUp} onKeyDown={this.onKeyDown} ref="searchInput" placeholder="Search your apps" />
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
    searchQuery: state.main.searchQuery,
    isFinding: state.main.isFinding
  }
}

const ConnectedTopbar = connect(mapStateToProps, {
  logout: main.logout,
  search: main.search,
  toggleFullscreen: main.toggleFullscreen,
  toggleFind: main.toggleFind,
  loadTilesListModal: modal.loadTilesListModal
})(Topbar)
export default ConnectedTopbar
