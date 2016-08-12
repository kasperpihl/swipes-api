var React = require('react');
var Row = require('./grid_row');
var Resizer = require('./grid_resizer');
var CollapsingOverlay = require('./grid_collapsing_overlay');
var Column = React.createClass({
  renderResizer(){
    if(this.props.columnIndex > 0){
      return <Resizer columnIndex={this.props.columnIndex} delegate={this.props.delegate} />;
    }
  },
  render(){
    var data = this.props.data;
    // Find transitions for style from grid, if any.
    var styles = {
      width: data.w + '%'
    };
    var className = "sw-resizeable-column";

    if(data.collapsed){
      className += " sw-collapsed-column";
      styles.width = this.props.delegate.collapsedWidth() + '%';
    }

    
    var transitions = this.props.delegate.transitionForColumn(this.props.columnIndex);
    if(transitions){
      if(transitions.styles){
        styles = Object.assign(styles, transitions.styles);
      }
      if(transitions.classes.length){
        className += " " + transitions.classes.join(' ');
      }
    }


    var rows = data.rows.map(function(row, i){
      return <Row columnIndex={this.props.columnIndex} rowIndex={i} delegate={this.props.delegate} callGridDelegate={this.props.callGridDelegate} data={row} key={"row-" + row.id }/>;
    }.bind(this));



    return (
      <div id={"column-" + this.props.columnIndex} className={className} style={styles}>
        {this.renderResizer()}
        <CollapsingOverlay />
        {rows}
      </div>
    )

  }
});

module.exports = Column;