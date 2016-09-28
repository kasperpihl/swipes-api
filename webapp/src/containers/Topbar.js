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
    bindAll(this, ['gradientStep', 'onChangeMenu', 'toggleDropdown', 'clickedFind']);
  }
  componentDidMount() {
    this.gradientStep();
    ipcRenderer.on('toggle-find', () => {
      const { isFinding, toggleFind } = this.props;
      if (!isFinding) {
        toggleFind();
      }
    })
    ipcRenderer.on('new-tile', () => {
      const { isFinding, loadTilesListModal, setOverlay } = this.props;
      if (!isFinding) {
        setOverlay('TemplateSelector');
      }
    })
    window.addEventListener('keydown', (e) => {
      if (e.keyCode === 27 && this.props.isFinding) {
        this.props.toggleFind();
      }
    });
  }
  clickedFind(){
    this.props.toggleFind();
  }
  signout() {
  }
  onClickWorkspace(){

  }
  onChangeMenu(id){
    if(id === 'services'){
      this.props.setOverlay('Services');
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
  renderProfile(){
    const { profilePic } = this.props;
    if(profilePic){
      return <img src={profilePic} />;
    }
    else {
      return <img src="http://www.avatarys.com/var/albums/Cool-Avatars/Facebook-Avatars/500x500-facebook-avatars/cute-fluffy-monster-facebook-avatar-500x500.png?m=1455128230" />;
    }
  }
  render() {

    var topbarClass = 'sw-topbar';
    var styles = gradient.getGradientStyles();

    if(this.state.gradientPos) {
      styles.backgroundPosition = this.state.gradientPos + '% 50%';
    }

    let selectedTitle = 'Workspace'
    const { pathname, fullscreenTitle, fullscreenSubtitle, } = this.props;
    const dropdownStructure = [
      { title: 'Workspace', id: 'workspace' },
      { title: 'Services', id: 'services' },
      { title: 'Log out', id: 'logout' }
    ];

    return (
      <div className="topbar" id="topbar" style={styles}>

        <div className="topbar__nav">
          <div className="topbar__profile">
            {this.renderProfile()}
          </div>

          <div className="topbar__title" onClick={this.toggleDropdown}>
            {selectedTitle}
            <i className="material-icons">arrow_drop_down</i>
            <DropdownMenu show={this.state.showDropdown} data={dropdownStructure} onChange={this.onChangeMenu}/>
          </div>
        </div>

        <div className="topbar__actions">
          <div className="topbar__button" onClick={this.clickedFind}>
            <FindIcon className="topbar__button--find"/>
          </div>
        </div>

      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    profilePic: state.getIn(['me', 'profile_pic']),
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
