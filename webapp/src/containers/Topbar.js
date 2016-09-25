import React, { Component, PropTypes } from 'react'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import { main, modal } from '../actions'
import { bindAll } from '../classes/utils'
import '../components/topbar/topbar.scss'
import DropdownMenu from '../components/swipes-ui/DropdownMenu'
import { FindIcon, WorkspaceIcon, PlusIcon } from '../components/icons';
import gradient from '../components/topbar/gradient';

const { ipcRenderer } = nodeRequire('electron');

class Topbar extends Component {
  constructor(props) {
    super(props)
    var gradientPos = gradient.getGradientPos();
    this.state = {
      gradientPos: gradientPos,
      showDropdown: false
    };
    bindAll(this, ['gradientStep', 'onKeyDown', 'onKeyUp', 'onChangeMenu']);
  }
  componentDidMount() {
    this.gradientStep();
    ipcRenderer.on('toggle-find', () => {
      if (!this.props.isFinding) {
        this.props.toggleFind();
      }
    })
    ipcRenderer.on('new-tile', () => {
      if (!this.props.isFinding) {
        this.props.loadTilesListModal();
      }
    })
    window.addEventListener('keydown', (e) => {
      if (e.keyCode === 27 && this.props.isFinding) {
        this.props.toggleFind();
      }
    });
  }
  componentDidUpdate(prevProps){
    if(this.props.isFinding && !prevProps.isFinding && document.activeElement !== this.refs.searchInput){
      this.refs.searchInput.select()
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
      const { pathname } = this.props;
      if(pathname !== '/'){
        browserHistory.push('/');
      }
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
  toggleDropdown() {
    this.setState({showDropdown: !this.state.showDropdown})
  }
  render() {

    var topbarClass = 'sw-topbar';
    var styles = gradient.getGradientStyles();

    if(this.state.gradientPos) {
      styles.backgroundPosition = this.state.gradientPos + '% 50%';
    }

    if(this.props.isFullscreen) {
      topbarClass += ' sw-topbar--fullscreen'
    }
    if(this.props.isFinding){
      topbarClass += ' sw-topbar--find';
    }

    // dummy data for DropdownMenu

    let selectedTitle = 'Workspace'
    const { pathname, fullscreenTitle, fullscreenSubtitle } = this.props;
    const dropdownStructure = [
      { title: 'Workspace', id: 'workspace' },
      { title: 'Services', id: 'services' },
      { title: 'Log out', id: 'logout' }
    ];
    if(pathname === '/services'){
      selectedTitle = 'Services';
    }
    if(!this.props.hasLoaded){
      styles.display = 'none';
    }

    return (
      <div className={topbarClass} id="topbar" style={styles}>
        <div className="sw-topbar__content">
          <div className="sw-topbar__info">
            <div className="sw-topbar__info__title" onClick={this.toggleDropdown.bind(this)}>
              {selectedTitle}
              <i className="material-icons">arrow_drop_down</i>
              <DropdownMenu show={this.state.showDropdown} data={dropdownStructure} onChange={this.onChangeMenu}/>
            </div>
            <div className="sw-topbar__info__tile-title">
              <div className="sw-topbar__info__tile-title--title">{fullscreenTitle}</div>
              <div className="sw-topbar__info__tile-title--seperator"></div>
              <div className="sw-topbar__info__tile-title--subtitle">{fullscreenSubtitle}</div>
            </div>
          </div>
          <div className="sw-topbar__searchbar">
            <input onKeyUp={this.onKeyUp} onKeyDown={this.onKeyDown} ref="searchInput" placeholder="Search your apps" />
          </div>
          <div className="sw-topbar__actions">
            <div className="sw-topbar__button sw-topbar__button--find" onClick={this.clickedFind.bind(this)}>
              <FindIcon />
            </div>
            <div className="sw-topbar__button sw-topbar__button--add" onClick={this.clickedAdd.bind(this)}>
              <PlusIcon />
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
    fullscreenTitle: state.main.fullscreenTitle,
    fullscreenSubtitle: state.main.fullscreenSubtitle,
    searchQuery: state.main.searchQuery,
    isFinding: state.main.isFinding,
    hasLoaded: state.main.hasLoaded
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
