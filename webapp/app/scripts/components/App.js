import actions from '../actions'
import Topbar from './topbar/Topbar'
import SearchResults from './SearchResults'
import Modal from './Modal'

var React = require('react');
var Reflux = require('reflux');

var App = React.createClass({
  componentDidMount:function() {
    amplitude.logEvent('Session - Opened App');
    mixpanel.track('Opened App');
  },
  render: function () {
    return (
      <div className="main">
        <Topbar />
        <div className="active-app">
          {this.props.children}
        </div>
        <SearchResults />
        <Modal />
      </div>
    );
  }
});

module.exports = App;
