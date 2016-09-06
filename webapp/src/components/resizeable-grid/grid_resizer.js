var React = require('react');
import { throttle } from '../../classes/utils'
var Resizer = React.createClass({
  componentDidMount(){
  },
  onDragStart(e){
    this.lastX = e.clientX;
    this.lastY = e.clientY;
    var dragImgEl = document.createElement('span');
    dragImgEl.setAttribute('style', 'position: absolute; display: block; top: 0; left: 0; width: 0; height: 0;' );
    document.body.appendChild(dragImgEl);
    e.dataTransfer.setDragImage(dragImgEl, 0, 0);
    if(this.props.isRow){
      this.props.delegate.rowWillResize(this.props.columnIndex, this.props.rowIndex);
    }else{
      this.props.delegate.columnWillResize(this.props.columnIndex);
    }

  },
  onDrag(e){
    if(e.clientX && e.clientY){

      var diffX = (e.clientX - this.lastX);
      var diffY = (e.clientY - this.lastY);
      if(this.props.isRow && diffY){
        this.props.delegate.rowResize(diffY);
      }
      if(!this.props.isRow && diffX){
        this.props.delegate.columnResize(diffX);
      }

      this.lastX = e.clientX;
      this.lastY = e.clientY;
    }
    e.stopPropagation();
  },
  onDragEnd(e){
    e.stopPropagation();
    if(this.props.isRow){
      this.props.delegate.rowDidResize();
    } else{
      this.props.delegate.columnDidResize();
    }

  },
  render(){
    var className = "sw-resize-vertical";
    if(this.props.isRow){
      className = "sw-resize-horizontal";
    }
    return <div onDragStart={this.onDragStart} onDrag={this.onDrag} onDragEnd={this.onDragEnd} draggable="true" className={className}/>;
  }
});

module.exports = Resizer;
