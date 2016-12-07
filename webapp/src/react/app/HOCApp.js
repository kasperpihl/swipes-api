import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import { api, navigation } from 'actions';

import Topbar from './topbar/Topbar';
import Modal from './modal/HOCModal';
import ViewController from './view-controller/HOCViewController';
import Sidebar from './sidebar/HOCSidebar';
import Overlay from './overlay/HOCOverlay';
import Toasty from './toasty/HOCToasty';

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
  render() {
    const { location } = this.props;

    return (
      <div className="app">
        <Topbar pathname={location.pathname} />
        <div className="content-wrapper">
          <Sidebar />
          <ViewController />
        </div>
        <Overlay />
        <Modal />
        <Toasty />
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
