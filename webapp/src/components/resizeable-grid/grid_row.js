var React = require('react');
var Resizer = require('./grid_resizer');
import Topbar from './grid_topbar'
var CollapsingOverlay = require('./grid_collapsing_overlay');
var Row = React.createClass({
  renderResizer(){
    if(this.props.rowIndex > 0){
      return <Resizer isRow={true} columnIndex={this.props.columnIndex} rowIndex={this.props.rowIndex} delegate={this.props.delegate} />;
    }
  },
  renderTopbar(){
    return <Topbar delegate={this.props.delegate} data={this.props.data} columnIndex={this.props.columnIndex} rowIndex={this.props.rowIndex} />
  },
  renderResizingOverlay(){
    return null; (
      <div className="sw-resizing-overlay">
        <CollapsingOverlay />
        {this.props.callGridDelegate('gridRenderResizeOverlayForId', this.props.data.id)}
      </div>
    );
  },
  render(){
    const {
      data
    } = this.props;

    var styles = {
      height: data.h + '%'
    };

    var className = "sw-resizeable-row";
    if(data.collapsed){
      className += " sw-collapsed-row";
      styles.height = this.props.delegate.collapsedHeight(this.props.columnIndex) + '%';
    }



    var transitions = this.props.delegate.transitionForRow(this.props.columnIndex, this.props.rowIndex);
    var rippleStyles = {};

    if(transitions){
      if(transitions.styles){
        styles = Object.assign(styles, transitions.styles);
      }
      if(transitions.rippleStyles){
        rippleStyles = transitions.rippleStyles;
      }
      if(transitions.classes.length){
        className += " " + transitions.classes.join(' ');
      }
    }

    var child = this.props.callGridDelegate('gridRenderRowForId', data.id);

    return (
      <div className={className} id={"row-" + data.id } ref="row" style={styles}>
        <div className="transition-ripple" style={rippleStyles} />

        {this.renderResizingOverlay()}
        {this.renderTopbar()}
        {this.renderResizer()}
        <div className="sw-row-content">{child}</div>
      </div>
    )
  }
});

module.exports = Row;
