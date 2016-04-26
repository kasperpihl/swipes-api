var React = require('react');
var moment = require('moment');
var modalActions = require('../../actions/ModalActions');
var Loading = require('../loading');
var CircularProgress = require('material-ui/lib/circular-progress');

var LightboxModal = React.createClass({
  getInitialState: function() {
    return {
      loading: 'active',
      lightboxImg: 'inactive'
    }
  },
  componentDidMount: function(){

    window.focus();
	},
  closeModal: function(e) {
    var lightboxWrapper = this.refs.lightboxwrapper;

    if(e.target !== lightboxWrapper) {
       return;
    }

    modalActions.hide();
  },
  imgLoaded: function() {
    this.setState({lightboxImg: 'active'});
    this.setState({loading: 'inactive'});
  },
  renderImage: function() {
  },
  render: function() {
    var options = this.props.data.options;

    var ww = window.innerWidth;
    var wh = window.innerHeight;

    return (
      <div className="lightbox" ref="lightboxwrapper" style={{width: ww, height: wh}} onClick={this.closeModal} >
        <h2 className="image-title">{options.message}</h2>
        <img src={options.title} className={'lightbox-image ' + this.state.lightboxImg} ref='lightboxImage' onLoad={this.imgLoaded}/>
        <div className={'lightbox-loader ' + this.state.loading}>
  				<CircularProgress color="#fff" size={1}/>
  			</div>
      </div>
    )
  }
})

module.exports = LightboxModal;
