import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import { api } from '../actions';

import Topbar from './Topbar';
import Modal from './Modal';
import Goals from './Goals';
import Overlay from './Overlay';
import Toasty from '../components/toasty/HOCToasty';

let DevTools = 'div';

if (process.env.NODE_ENV !== 'production') {
  DevTools = require('../DevTools'); // eslint-disable-line global-require
}

class App extends Component {
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
    let classes = 'main ';
    const { mainClasses, location } = this.props;

    if (mainClasses) {
      classes += mainClasses.toArray().join(' ');
    }
    return (
      <div className={classes}>
        <Topbar pathname={location.pathname} />
        <Goals />
        <Overlay />
        <Modal />
        <Toasty />
        <DevTools />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    mainClasses: state.getIn(['main', 'mainClasses']),
  };
}

const { func, array, object } = PropTypes;

App.propTypes = {
  request: func,
  mainClasses: array,
  location: object,
};

const ConnectedApp = connect(mapStateToProps, {
  request: api.request,
})(App);
export default ConnectedApp;
