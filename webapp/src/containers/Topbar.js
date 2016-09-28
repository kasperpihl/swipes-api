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
import PureRenderMixin from 'react-addons-pure-render-mixin';

class Topbar extends Component {
  constructor(props) {
    super(props)
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    var gradientPos = gradient.getGradientPos();
    this.state = {
      gradientPos: gradientPos,
      showDropdown: false
    };
    bindAll(this, ['gradientStep', 'onChangeMenu', 'toggleDropdown', 'clickedFind', 'clickedAdd']);
  }
  componentDidMount() {
    // this.gradientStep();
    ipcRenderer.on('toggle-find', () => {
      const { isFinding, toggleFind } = this.props;
      if (!isFinding) {
        toggleFind();
      }
    })
    ipcRenderer.on('new-tile', () => {
      const { isFinding, loadTilesListModal } = this.props;
      if (!isFinding) {
        loadTilesListModal();
      }
    })
    window.addEventListener('keydown', (e) => {
      if (e.keyCode === 27 && this.props.isFinding) {
        this.props.toggleFind();
      }
    });
  }
  clickedAdd(){
    const { pathname, isFinding, toggleFind, isFullscreen, toggleFullscreen, loadTilesListModal, setOverlay } = this.props
    if(isFinding){
      toggleFind();
    }
    else if(isFullscreen) {
      toggleFullscreen();
    }
    else {
      if(pathname !== '/'){
        browserHistory.push('/');
      }
      //setOverlay('TemplateSelector');
      loadTilesListModal();
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

    let selectedTitle = 'Workspace'
    const { pathname, fullscreenTitle, fullscreenSubtitle } = this.props;
    const dropdownStructure = [
      { title: 'Workspace', id: 'workspace' },
      { title: 'Services', id: 'services' },
      { title: 'Log out', id: 'logout' }
    ];

    return (
      <div className={topbarClass} id="topbar" style={styles}>
        <div className="sw-topbar__content">
          <div className="sw-topbar__info">
            <div className="sw-topbar__info__title" onClick={this.toggleDropdown}>
              {selectedTitle}
              <i className="material-icons">arrow_drop_down</i>
              <DropdownMenu show={this.state.showDropdown} data={dropdownStructure} onChange={this.onChangeMenu}/>
            </div>
          </div>
          <div className="sw-topbar__actions">
            <div className="sw-topbar__button sw-topbar__button--find" onClick={this.clickedFind}>
              <FindIcon />
            </div>
            <div className="sw-topbar__button sw-topbar__button--add" onClick={this.clickedAdd}>
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
    isFullscreen: state.getIn(['main', 'isFullscreen']),
    fullscreenTitle: state.getIn(['main', 'fullscreenTitle']),
    fullscreenSubtitle: state.getIn(['main', 'fullscreenSubtitle']),
    searchQuery: state.getIn(['main', 'searchQuery']),
    isFinding: state.getIn(['main', 'isFinding']),
    hasLoaded: state.getIn(['main', 'hasLoaded'])
  }
}

const ConnectedTopbar = connect(mapStateToProps, {
  logout: main.logout,
  search: main.search,
  toggleFullscreen: main.toggleFullscreen,
  toggleFind: main.toggleFind,
  setOverlay: main.setOverlay,
  loadTilesListModal: modal.loadTilesListModal
})(Topbar)
export default ConnectedTopbar
