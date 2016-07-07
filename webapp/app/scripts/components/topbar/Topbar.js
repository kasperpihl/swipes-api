import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { main } from '../../actions';

//var stateStore = require('../../stores/StateStore');
var gradient = require('./gradient');

class Topbar extends Component {
  constructor(props) {
    super(props)
    this.state = {};
    this.gradientStep = this.gradientStep.bind(this);
  }
  componentDidMount() {
    this.gradientStep();
  }
  clickedAdd(){
    if(this.props.isSearching){
      this.props.toggleSearching();
    }
    if(this.props.isFullscreen) {
      this.props.toggleFullscreen();
    }
    else {
      //topbarActions.loadWorkflowModal();
    }
  }
  clickedSearch(){
    this.props.toggleSearching();
  }
  signout() {
    amplitude.setUserId(null); // Log out user from analytics
    stateStore._reset({trigger: false});
    localStorage.clear();
    swipesApi.setToken(null);
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
    console.log('rend', this.props, this.state);
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
      <div className={topbarClass} style={styles}>
        <div className="sw-topbar__content">
          <div className="sw-topbar__info">
            <div className="sw-topbar__info__icon">
              <img src="styles/img/workspace-icon.svg" alt=""/>
            </div>
            <div className="sw-topbar__info__title">my workspace</div>
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
  toggleFullscreen: main.toggleFullscreen,
  toggleSearching: main.toggleSearching
})(Topbar)
export default ConnectedTopbar
