import React, { Component, PropTypes } from 'react'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import { main, modal, overlay } from '../actions'
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
    bindAll(this, ['gradientStep', 'onChangeMenu', 'toggleDropdown', 'clickedFind', 'clickedBack', 'clickedProfile']);
  }
  componentDidMount() {
    this.gradientStep();
    const { setOverlay, clearOverlay, pushOverlay } = this.props;
    ipcRenderer.on('toggle-find', () => {
      this.clickedFind();
    })
    ipcRenderer.on('new-tile', () => {
      setOverlay({ component: 'StartGoal', title: 'Start a Goal' });
    })
    window.addEventListener('keydown', (e) => {
      if (e.keyCode === 27) {
        clearOverlay();
      }
    });
  }
  clickedFind(){
    this.props.setOverlay({ component: 'Find', title: 'Find' });
  }
  clickedBack(){
    this.props.clearOverlay();
  }
  clickedProfile(){
    this.props.setOverlay({ component: 'Profile', title: 'Profile' });
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
  clickedClear(i){
    const { clearOverlay } = this.props;
    clearOverlay(i);
  }
  renderBreadcrumb(){
    const { overlays } = this.props;
    if(overlays.size){
      const crumbs = overlays.map((overlay, i) => {
        return <div key={"crumb-"+i} onClick={this.clickedClear.bind(this, i)} className="topbar__nav__crumb">{overlay.get('title')}</div>
      })
      return (
        <div className="topbar__nav">
          <div className="topbar__nav__back" onClick={this.clickedBack}>
            <i className="material-icons">close</i>
          </div>
          <div className="topbar__nav__crumbs">
            {crumbs}
          </div>
        </div>
      )
    }
  }
  renderNav(){
    let selectedTitle = 'Workspace'
    const { overlays, organizations } = this.props;
    let title = "Workspace";
    if(organizations && organizations.size){
      title = organizations.first().get('name')
    }
    if(!overlays.size){
      return (
        <div className="topbar__nav">
          <div className="topbar__profile" onClick={this.clickedProfile}>
            {this.renderProfile()}
          </div>

          <div className="topbar__title" onClick={this.clickedProfile}>
            {title}
          </div>
        </div>
      )
    }
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
  renderButtons(){
    const { overlays } = this.props;
    const buttons = [];
    if(!overlays.size || overlays.last().get('component') !== 'Find'){
      buttons.push(
        <div key="find-button" className="topbar__button" onClick={this.clickedFind}>
          <FindIcon className="topbar__button--find"/>
        </div>
      )
    }
    return buttons;
  }
  render() {

    var topbarClass = 'sw-topbar';
    var styles = gradient.getGradientStyles();

    if(this.state.gradientPos) {
      styles.backgroundPosition = this.state.gradientPos + '% 50%';
    }


    const { pathname, fullscreenTitle, fullscreenSubtitle } = this.props;

    return (
      <div className="topbar" id="topbar" style={styles}>
        {this.renderNav()}
        {this.renderBreadcrumb()}

        <div className="topbar__actions">
          {this.renderButtons()}
        </div>

      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    overlays: state.get('overlays'),
    organizations: state.getIn(['me', 'organizations']),
    profilePic: state.getIn(['me', 'profile_pic']),
    fullscreenTitle: state.getIn(['main', 'fullscreenTitle']),
    fullscreenSubtitle: state.getIn(['main', 'fullscreenSubtitle']),
    searchQuery: state.getIn(['main', 'searchQuery']),
    hasLoaded: state.getIn(['main', 'hasLoaded'])
  }
}

const ConnectedTopbar = connect(mapStateToProps, {
  logout: main.logout,
  search: main.search,
  toggleFullscreen: main.toggleFullscreen,
  toggleFind: main.toggleFind,
  loadModal: modal.load,
  setOverlay: overlay.set,
  clearOverlay: overlay.clear,
  pushOverlay: overlay.push
})(Topbar)
export default ConnectedTopbar
