import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import { api, navigation } from 'actions';

import Topbar from './topbar/Topbar';
import HOCModal from './modal/HOCModal';
import HOCViewController from './view-controller/HOCViewController';
import HOCSidebar from './sidebar/HOCSidebar';
import HOCOverlay from './overlay/HOCOverlay';
import HOCToasty from './toasty/HOCToasty';
import HOCSideNote from './side-note/HOCSideNote';
import HOCContextMenu from './context-menu/HOCContextMenu';

let DevTools = 'div';

if (process.env.NODE_ENV !== 'production') {
  DevTools = require('src/DevTools'); // eslint-disable-line global-require
}

class HOCApp extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
  componentDidMount() {
    const { request, navInit } = this.props;
    navInit();
    request('rtm.start').then((res) => {
      if (res && res.ok) {
        navInit();
      }
    });

    // Massive hack to not be able to drop files into swipes so it wouldn't redirect

    document.addEventListener('dragover', (e) => {
      e.preventDefault();
      return false;
    });

    document.addEventListener('drop', (e) => {
      e.preventDefault();
      return false;
    });
  }
  renderNote() {
    return <HOCSideNote />;
  }
  render() {
    const { location } = this.props;

    return (
      <div className="app">
        <Topbar pathname={location.pathname} />
        <div className="content-wrapper">
          <HOCSidebar />
          <HOCViewController />
          <HOCSideNote />
        </div>
        <HOCOverlay />
        <HOCModal />
        <HOCToasty />
        <HOCContextMenu />
        <DevTools />
      </div>
    );
  }
}

const { func, object } = PropTypes;

HOCApp.propTypes = {
  request: func,
  navInit: func,
  location: object,
};

const ConnectedHOCApp = connect(null, {
  request: api.request,
  navInit: navigation.init,
})(HOCApp);
export default ConnectedHOCApp;
