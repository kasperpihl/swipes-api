var React = require('react');


var LightboxModal = React.createClass({
  getInitialState: function() {
    return {
      loading: 'active',
      lightboxImg: 'inactive'
    }
  },
  propTypes: {
    hide: React.PropTypes.func
  },
  componentDidMount: function(){
    window.focus();
	},
  closeModal: function(e) {
    var lightboxWrapper = this.refs.lightboxwrapper;
    var lightboxButton = this.refs.lightboxbutton;
    const { hide } = this.props.data;
    if(e.target === lightboxWrapper || (e.target === lightboxButton)) {
      hide();
    }
  },
  imgLoaded: function() {
    this.setState({lightboxImg: 'active'});
    this.setState({loading: 'inactive'});
  },
  renderOpenImage: function() {
    var options = this.props.data.options;

    if(this.state.lightboxImg === 'active' && (options.url.length > 0)) {
      return (
        <a className="lightbox-button" href={options.url} target="_blank" ref="lightboxbutton" onClick={this.closeModal}>Open image</a>
      )
    }
  },
  render: function() {
    var options = this.props.data.options;

    var ww = window.innerWidth;
    var wh = window.innerHeight;

    return (
      <div className="lightbox" ref="lightboxwrapper" style={{width: ww, height: wh}} onClick={this.closeModal} >
        <h2 className="image-title">{options.title}</h2>
        <img src={options.src} className={'lightbox-image ' + this.state.lightboxImg} ref='lightboxImage' onLoad={this.imgLoaded}/>
        <div className={'lightbox-loader ' + this.state.loading}>
  				Loading
  			</div>
        {this.renderOpenImage()}
      </div>
    )
  }
})

module.exports = LightboxModal;
