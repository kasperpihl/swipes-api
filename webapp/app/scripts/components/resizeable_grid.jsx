var React = require('react');

var dataSource = {
  "renderGridRowForId": {
    required: true
  }
};

var Grid = React.createClass({
  getInitialState() {
      return {
          columns: this.props.columns
      };
  },
  // ======================================================
  // Resize Delegate
  // ======================================================
  columnWillResize(columnIndex){
    this.resizingColumnIndex = columnIndex;
  },
  columnResize(diffX){
    var addedWidth = -diffX;
    var column = this.columnForIndex(this.resizingColumnIndex);
    var size = this.pixelsFromPercentage(column.w);
    var newSize = size + addedWidth;

    var columns = this.state.columns;
    var i = this.resizingColumnIndex - 1;
    columns[this.resizingColumnIndex].w = this.percentageFromPixels(newSize);
    do{
      var column = columns[i];
      var cw = this.pixelsFromPercentage(column.w);

      columns[i].w = this.percentageFromPixels(cw - addedWidth);
      i--;
      console.log('cw', cw, 'nw', (cw - addedWidth), 'c%', this.percentageFromPixels(cw - addedWidth));
    }
    while (i >= 0);

    // Check if percentages is 100%

    this.setState({columns: columns});

  },
  columnDidResize(){
  },



  callDelegate(name){
    if(this.props.delegate && typeof this.props.delegate[name] === "function"){
      return this.props.delegate[name].apply(null, [this].concat(Array.prototype.slice.call(arguments, 1)));
    }
  },
  columnsArrayPercentages(){
    var arr = [];
    this.state.columns.forEach(function(column){
      arr.push(column.w);
    })
    return arr;
  },
  columnsArrayPixels(){
    var arr = [];
    this.state.columns.forEach(function(column){
      arr.push(this.pixelsFromPercentage(column.w));
    }.bind(this))
    return arr;
  },
  // ======================================================
  // Conversions
  // ======================================================
  percentageFromPixels(pixels){
    // K_TODO: Cache the width to not query grid all the time.
    const grid = document.querySelector('.grid');
    const gw = grid.clientWidth;
    return (pixels / gw * 100).toFixed(2);
  },
  pixelsFromPercentage(percentage){
    // K_TODO: Cache the width to not query grid all the time.
    const grid = document.querySelector('.grid');
    const gw = grid.clientWidth;
    return Math.round(gw / 100 * percentage);
  },
  rowFromColumn(columnIndex, rowIndex){
    var columns = this.state.columns;
    var rows = columns[columnIndex];
    return rows[rowIndex];
  },
  columnForIndex(index){
    var columns = this.state.columns;
    return columns[index];
  },


  // ======================================================
  // Render methods
  // ======================================================
  render(){

    var columns = this.state.columns.map(function(column, i){
      return <Grid.Column columnIndex={i} delegate={this} callGridDelegate={this.callDelegate} key={"column-" + i} data={column} />;
    }.bind(this));

    return (
      <div className="grid">
        {columns}
      </div>
    )
  }
});


Grid.Resizer = React.createClass({
  onDragStart(e){
    this.lastX = e.clientX;
    this.lastY = e.clientY;
    var dragImgEl = document.createElement('span');
    dragImgEl.setAttribute('style', 'position: absolute; display: block; top: 0; left: 0; width: 0; height: 0;' );
    document.body.appendChild(dragImgEl);
    e.dataTransfer.setDragImage(dragImgEl, 0, 0);
    this.props.delegate.columnWillResize(this.props.columnIndex);
  },
  onDrag(e){
    if(e.clientX && e.clientY){

      var diffX = (e.clientX - this.lastX);
      var diffY = (e.clientY - this.lastY);
      if(diffX){
        this.props.delegate.columnResize(diffX);
      }

      this.lastX = e.clientX;
      this.lastY = e.clientY;
    }

  },
  onDragEnd(e){
    this.props.delegate.columnDidResize();
  },
  render(){
    return <div onDragStart={this.onDragStart} onDrag={this.onDrag} onDragEnd={this.onDragEnd} draggable="true" className="resize-vertical"/>;
  }
});



Grid.Column = React.createClass({
  renderResizer(){
    if(this.props.columnIndex > 0){
      return <Grid.Resizer columnIndex={this.props.columnIndex} delegate={this.props.delegate} />;
    }
  },
  render(){
    var data = this.props.data;
    var styles = {
      width: data.w + '%'
    };

    var rows = data.rows.map(function(row, i){
      return <Grid.Row columnIndex={this.props.columnIndex} rowIndex={i} delegate={this.props.delegate} callGridDelegate={this.props.callGridDelegate} data={row} key={"row-" + i }/>;
    }.bind(this));

    return (
      <div className="column" style={styles}>
        {this.renderResizer()}
        {rows}
      </div>
    )

  }
});

Grid.Row = React.createClass({
  renderResizer(){
    if(this.props.rowIndex > 0){
      return <div className="resize-horizontal" />;
    }
  },
  calcScale(gw, gh, rw, rh) {
    var curSizeX = (rw * 100) / gw;
    var curSizeY = 1;
    if (rh < gw) {
      var curSizeY = (rh * 100) / gh;
    }
    var sizeToBe = {
      w: 100 / curSizeX,
      h : 100 / curSizeY
    };

    return sizeToBe
  },
  onMaximize(e) {
     const {
      data,
      initData
    } = this.props;
    const row = this.refs.row;
    const columnLength = 4;
    const grid = document.querySelector('.grid');
    const gw = grid.clientWidth;
    const gh = grid.clientHeight;
    const rw = row.clientWidth;
    const rh = row.clientHeight;
    const rPos = row.getBoundingClientRect();
    const currentScale = row.style.transform;
    const scaleTo = this.calcScale(gw, gh, rw, rh);
    const centerXPercentage = (rPos.left * 100) / ((gw - rPos.right) + rPos.left);
    const centerYPercentage = (rPos.top * 100) / ((gh - rPos.bottom) + rPos.top);

    let originX = 50;
    let originY = 50;

    row.parentNode.classList.toggle('maximize');
    row.classList.toggle('maximize');

    if(currentScale) {
      row.style.transform = '';
      // row.style.transformOrigin = '';
    } else {

      // column logic
      if (columnIndex === 0) { // First Column
        originX = 0;
      }
      if (columnIndex === (columnLength - 1)) { // Last column
        originX = 100;
      }
      if (columnIndex > 0 && columnIndex < (columnLength - 1)) { // Columns in the middle
        originX = centerXPercentage;
      }

      // Row logic
      if (rowIndex === 0 && (rowsInColumn - 1) > 0) { // first row, but more than one
        originY = 0;
      }
      if (rowIndex === (rowsInColumn - 1) && (rowsInColumn - 1) > 0) { // last row, but more than one
        originY = 100;
      }
      if (rowIndex > 0 && rowIndex < (rowsInColumn - 1)) { // Rows in the middle
        originY = centerYPercentage;
      }

      row.style.transformOrigin = originX + '% ' + originY + '%';
      row.style.transform = 'scaleX(' + scaleTo.w + ') scaleY(' + scaleTo.h + ')';
    }

  },
  render(){
    const {
      data
    } = this.props;
    const styles = {
      height: data.height
    };
    var child = this.props.callGridDelegate('renderGridRowForId', data.id);
    return (
      <div className="row" ref="row" style={styles} onClick={this.onMaximize}>
        {this.renderResizer()}
        {child}
      </div>
    )
  }
});
module.exports = Grid;
