import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import { api } from '../../actions';

import Topbar from './topbar/Topbar';
import Modal from './modal/HOCModal';
import ViewController from './view-controller/HOCViewController';
import Sidebar from './sidebar/HOCSidebar';
import Toasty from './toasty/HOCToasty';

let DevTools = 'div';

if (process.env.NODE_ENV !== 'production') {
  DevTools = require('../../DevTools'); // eslint-disable-line global-require
}

class HOCApp extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
  componentDidMount() {
    this.props.request('rtm.start');

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
        <Modal />
        <Toasty />
        <DevTools />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    navId: state.getIn(['navigation', 'currentId']),
  };
}

const { func, string, object } = PropTypes;

HOCApp.propTypes = {
  request: func,
  navId: string,
  location: object,
};

const ConnectedHOCApp = connect(mapStateToProps, {
  request: api.request,
})(HOCApp);
export default ConnectedHOCApp;
