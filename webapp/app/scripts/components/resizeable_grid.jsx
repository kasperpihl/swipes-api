var React = require('react');

var dataSource = {
  "renderGridRowForId": {
    required: true
  }
};

var Grid = React.createClass({
  // ======================================================
  // Life Cycle methods
  // ======================================================
  getInitialState() {
      return {
          columns: this.props.columns  
      };
  },
  componentWillUpdate(nextProps, nextState){

  },
  componentDidUpdate(prevProps, prevState) {
        
  },

  // ======================================================
  // Render methods
  // ======================================================
  render(){

    var columns = this.state.columns.map(function(column, i){
      return <Grid.Column columnIndex={i} delegate={this} callGridDelegate={this.callDelegate} key={"column-" + i} data={column} />;
    }.bind(this));

    return (
      <div className="sw-resizeable-grid">
        {columns}
      </div>
    )
  },

  // ======================================================
  // Resize Delegate
  // ======================================================
  columnWillResize(columnIndex){
    this.resizingColumnIndex = columnIndex;
  },
  rowWillResize(columnIndex, rowIndex){
    this.resizingColumnIndex = columnIndex;
    this.resizingRowIndex = rowIndex;
  },
  columnResize(diffX){
    

    var percentages = this.columnsArrayPercentages();
    var pixels = this.columnsArrayPixels();
    

    var addedWidth = -diffX;
    var newSize = pixels[this.resizingColumnIndex] + addedWidth;


    percentages[this.resizingColumnIndex] = this.percentageWidthFromPixels(newSize);

    var prevI = this.resizingColumnIndex - 1;
    percentages[prevI] = this.percentageWidthFromPixels(pixels[prevI] - addedWidth);

    
    // Add percentages to columns and check if 100%
    this.saveColumnPercentagesToState(percentages, prevI);

  },
  rowResize(diffY){
    var colI = this.resizingColumnIndex;
    var rowI = this.resizingRowIndex;

    var percentages = this.rowsArrayPercentages(colI);
    var pixels = this.rowsArrayPixels(colI);
    

    var addedHeight = -diffY;
    var newSize = pixels[rowI] + addedHeight;


    percentages[rowI] = this.percentageWidthFromPixels(newSize);

    var prevI = this.resizingRowIndex - 1;
    percentages[prevI] = this.percentageWidthFromPixels(pixels[prevI] - addedHeight);

    
    // Add percentages to rows and check if 100%
    this.saveRowPercentagesToState(colI, percentages, prevI);
  },
  rowDidResize(){

  },
  rowDidResize(){
    this.columnDidResize();
  },
  columnDidResize(){
    var obj = JSON.parse(JSON.stringify(this.state.columns));
    this.callDelegate('gridDidUpdate', obj);
  },



  callDelegate(name){
    if(this.props.delegate && typeof this.props.delegate[name] === "function"){
      return this.props.delegate[name].apply(null, [this].concat(Array.prototype.slice.call(arguments, 1)));
    }
  },
  
  // ======================================================
  // Conversions
  // ======================================================
  percentageWidthFromPixels(pixels){
    // K_TODO: Cache the width to not query grid all the time.
    const grid = document.querySelector('.sw-resizeable-grid');
    const gw = grid.clientWidth;
    var percentage = (pixels / gw * 100);
    
    return this.roundedDecimal(percentage);
  },
  pixelsWidthFromPercentage(percentage){
    // K_TODO: Cache the width to not query grid all the time.
    const grid = document.querySelector('.sw-resizeable-grid');
    const gw = grid.clientWidth;
    return Math.round(gw / 100 * percentage);
  },
  percentageHeightFromPixels(pixels){
    // K_TODO: Cache the height to not query grid all the time.
    const grid = document.querySelector('.sw-resizeable-grid');
    const gh = grid.clientHeight;
    var percentage = (pixels / gh * 100);
    
    return this.roundedDecimal(percentage);
  },
  pixelsHeightFromPercentage(percentage){
    // K_TODO: Cache the height to not query grid all the time.
    const grid = document.querySelector('.sw-resizeable-grid');
    const gh = grid.clientHeight;
    return Math.round(gh / 100 * percentage);
  },
  roundedDecimal(number){
    return Math.round( number * 1e2 ) / 1e2;
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

  // ======================================================
  // Setters
  // ======================================================
  saveColumnPercentagesToState(percentages, overflowI){
    if(!percentages){
      percentages = this.columnsArrayPercentages();
    }
    var total = 0;
    var columns = this.state.columns;
    percentages.forEach(function(percent, i){
      total += percent;
      columns[i].w = percent;
    })
    total = this.roundedDecimal(total);
    if(total != 100){
      var width = columns[overflowI].w;
      columns[overflowI].w = this.roundedDecimal(width + (100 - total));
    }

    this.setState({columns: columns});

  },
  saveRowPercentagesToState(columnIndex, percentages, overflowI){
    if(!percentages){
      percentages = this.rowsArrayPercentages(columnIndex);
    }
    var total = 0;
    var columns = this.state.columns;
    var rows = this.state.columns[columnIndex].rows;
    percentages.forEach(function(percent, i){
      total += percent;
      rows[i].h = percent;
    })
    total = this.roundedDecimal(total);
    if(total != 100){
      var height = rows[overflowI].h;
      console.log(total);
      //columns[columnIndex].rows[overflowI].h = this.roundedDecimal(height + (100 - total));
    }

    this.setState({columns: columns});

  },


  // ======================================================
  // Getters
  // ======================================================
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
      arr.push(this.pixelsWidthFromPercentage(column.w));
    }.bind(this))
    return arr;
  },
  rowsArrayPercentages(columnIndex){
    var arr = [];
    this.state.columns[columnIndex].rows.forEach(function(row){
      arr.push(row.h);
    })
    return arr;
  },
  rowsArrayPixels(columnIndex){
    var arr = [];
    this.state.columns[columnIndex].rows.forEach(function(row){
      arr.push(this.pixelsHeightFromPercentage(row.h));
    }.bind(this))
    return arr;

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
  // Maximize row
  // ======================================================
  maximizeColumnWithRow(row, columnIndex, rowIndex) {
     const {
      data,
      initData
    } = this.props;
    const columnLength = this.state.columns.length;
    const rowsInColumn = this.state.columns[columnIndex].rows.length;
    const grid = document.querySelector('.sw-resizeable-grid');
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
    
  },
  onDragEnd(e){
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
      <div className="sw-resizeable-column" style={styles}>
        {this.renderResizer()}
        {rows}
      </div>
    )
      
  }
});

Grid.Row = React.createClass({
  renderResizer(){
    if(this.props.rowIndex > 0){
      return <Grid.Resizer isRow={true} columnIndex={this.props.columnIndex} rowIndex={this.props.rowIndex} delegate={this.props.delegate} />;
    }
  },
  onMaximize(e){
    this.props.delegate.maximizeColumnWithRow(this.refs.row, this.props.columnIndex, this.props.rowIndex);
  },
  render(){
    const {
      data
    } = this.props;
    const styles = {
      height: data.h + '%'
    };
    var child = this.props.callGridDelegate('renderGridRowForId', data.id);
    if(data.minimized){
      child = <div style={{background:"gray", width: '100%', height: "100%"}} />;
    }
    return (
      <div className="sw-resizeable-row" ref="row" style={styles} onClick={this.onMaximize}>
        {this.renderResizer()}
        {child}
      </div>
    )
  }
});
module.exports = Grid;
