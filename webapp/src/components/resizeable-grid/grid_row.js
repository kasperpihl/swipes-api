import React, { Component, PropTypes } from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin';

import Resizer from './grid_resizer'
import CollapsingOverlay from './grid_collapsing_overlay'

class GridRow extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.getChildObject = this.getChildObject.bind(this);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
  getChildObject(id){
    const { callGridDelegate } = this.props;
    return callGridDelegate('gridRenderRowForId', id);
  }
  renderResizer(){
    const { rowIndex, columnIndex, delegate } = this.props;
    if(rowIndex > 0){
      return <Resizer isRow={true} columnIndex={columnIndex} rowIndex={rowIndex} delegate={delegate} />;
    }
  }
  renderResizingOverlay(){
    const {
      data,
      callGridDelegate
    } = this.props;
    return (
      <div className="sw-resizing-overlay">
        <CollapsingOverlay />
        {callGridDelegate('gridRenderResizeOverlayForId', data.id)}
      </div>
    );
  }
  componentDidMount() {
  }
  render(){
    const {
      data,
      delegate,
      columnIndex,
      rowIndex
    } = this.props;

    var styles = {
      height: data.h + '%'
    };

    var className = "sw-resizeable-row";
    if(data.collapsed){
      className += " sw-collapsed-row";
      styles.height = delegate.collapsedHeight(this.props.columnIndex) + '%';
    }



    var transitions = delegate.transitionForRow(columnIndex, rowIndex);
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

    return (
      <div className={className} id={"row-" + data.id } ref="row" style={styles}>
        <div className="transition-ripple" style={rippleStyles} />

        {this.renderResizingOverlay()}
        {this.renderResizer()}
        <RowChild getChild={this.getChildObject} id={data.id} />
      </div>
    )
  }
}
export default GridRow


class RowChild extends React.Component {
  constructor(props) {
    super(props)
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
  render() {
    const { getChild, id } = this.props;
    const child = getChild(id);
    return (
      <div className="sw-row-content">{child}</div>
    )
  }
}
module.exports = GridRow;
