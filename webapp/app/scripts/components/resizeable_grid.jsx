var React = require('react');
var DEFAULT_MINWIDTH = 200;
var DEFAULT_MINHEIGHT = 200;
var Grid = React.createClass({
  // ======================================================
  // Life Cycle methods
  // ======================================================
  getInitialState() {
    return {};
  },
  componentDidMount() {
      this.debug = true;
      this.setState({columns: this.validateColumns(this.props.columns)});
  },
  componentWillReceiveProps(nextProps) {
    this.setState({columns: this.validateColumns(nextProps.columns)});
  },
  componentWillUpdate(nextProps, nextState){

  },
  componentDidUpdate(prevProps, prevState) {

  },

  // ======================================================
  // Validation methods
  // ======================================================
  validateColumns(columns){
    if(this.debug)
      console.log('starting validation');

    /*
      [ ] validateProperties // Go through columns/rows to make sure no invalid properties are used
      [ ] initialDetermination // check if columns have widths and rows have height
      [ ] assignWidthsAndHeights // If heights/widths were missing, assign them.
      [ ] adjustOverflows // If size is too big/small, adjust it
      [ ] determineAnimations
    */
    
    // Validation object, passed along the different validation functions and returned with updated values.
    var valObj = {
      columns: columns,
      minWidths: this.minWidthsForColumns(columns), // Array with minWidths as values []
      minHeights: this.minHeightsForRows(columns), 
      totalWidthUsed: 0
    };
    
    valObj = this.validatorInitialColumnDetermination(valObj); 
    if(this.debug) console.log('initial column determination', valObj);

    valObj = this.validatorInitialRowDetermination(valObj);
    if(this.debug) console.log('initial row determination', valObj);

    valObj = this.validatorAssignWidths(valObj);
    if(this.debug) console.log('assign widths', valObj);

    valObj = this.validatorAssignHeights(valObj);
    if(this.debug) console.log('assign heights', valObj);

    // If width used is different from 100 or a new column is here.
    if(Math.abs(valObj.totalWidthUsed - 100) > 0.01){
      valObj = this.validatorAdjustOverflows(valObj);
      if(this.debug) console.log('adjust overflows', valObj);
    }
    

    return valObj.columns;
  },
  validatorPropertiesOfColumns(columns){
    return columns;
  },
  validatorInitialColumnDetermination(valObj){
  
    valObj.columnsHaveEqualWidth = true;
    valObj.columnsThatNeedWidth = [];
    var rowsThatNeedHeight = {}

    var testColumnWidth = 0;
    valObj.columns.forEach(function(column, colI){
      var colWidth = column.w ? column.w : 0;

      if(colWidth){
        if(colI > 0 && colWidth != testColumnWidth){
          valObj.columnsHaveEqualWidth = false;
        }
        testColumnWidth = colWidth;
      }


      if(!colWidth){
        valObj.columnsThatNeedWidth.push(colI);
      }
      valObj.totalWidthUsed += colWidth;
    }.bind(this));

    return valObj;
  },
  validatorInitialRowDetermination(valObj){

    valObj.rowsThatNeedHeight = [];
    valObj.columnsEqualRowHeight = [];
    valObj.columnsTotalRowsHeight = [];

    valObj.columns.forEach(function(column, colI){

      var rowsHaveEqualHeight = true;
      var testRowHeight = 0;
      var totalRowHeight = 0;
      column.rows.forEach(function(row, rowI){
        var rowHeight = row.h ? row.h : 0;
        if(rowHeight){
          if(rowI > 0 && rowHeight != testRowHeight){
            rowsHaveEqualHeight = false;
          }
          testRowHeight = rowHeight;
        }
        if(!rowHeight){
          valObj.rowsThatNeedHeight.push(row.id);
        }
        totalRowHeight += rowHeight;

      }.bind(this));
      
      valObj.columnsEqualRowHeight.push(rowsHaveEqualHeight);
      valObj.columnsTotalRowsHeight.push(totalRowHeight);
      
      
    }.bind(this));
    
    return valObj;
  },
  validatorAssignWidths(valObj){

    valObj.totalWidthUsed = 0;
    valObj.columns.forEach(function(column, colI){
      var minWidth = valObj.minWidths[colI];
      if(valObj.columnsHaveEqualWidth){
        column.w = Math.max(minWidth, this.roundedDecimal(100 / valObj.columns.length));
      }
      else if(valObj.columnsThatNeedWidth.indexOf(colI) > -1){
        column.w = minWidth;
      }

      valObj.totalWidthUsed += column.w;
    
    }.bind(this));

    return valObj;
  },

  validatorAssignHeights(valObj){

    valObj.columns.forEach(function(column, colI){
      var totalHeight = 0;
      column.rows.forEach(function(row, rowI){
        var minHeight = valObj.minHeights[colI][rowI];
        if(valObj.columnsEqualRowHeight[colI]){
          row.h = Math.max(minHeight, this.roundedDecimal(100 / column.rows.length));
        }
        else if(valObj.rowsThatNeedHeight.indexOf(row.id) > -1){
          row.h = minHeight;
        }
        totalHeight += row.h;
        valObj.columnsTotalRowsHeight[colI] = totalHeight;
      }.bind(this));

    }.bind(this));

    return valObj;
  },
  validatorAdjustOverflows(valObj){
    var reverse = true; // K_TODO: make dynamic here

    var additionalWidth = valObj.totalWidthUsed - 100;

    var remainingPercentageToAdd = additionalWidth;

    for(var i = 0 ; i < valObj.columns.length ; i++){
      if(!remainingPercentageToAdd){
        break;
      }
      var realIndex = i;
      if(reverse){
        realIndex = this.reverseIndexFromArray(i, valObj.columns);
      }
      var minWidth = valObj.minWidths[realIndex];
      var width = valObj.columns[realIndex].w;
      width = width - remainingPercentageToAdd;

      remainingPercentageToAdd = 0;
      if(width < minWidth){
        remainingPercentageToAdd = minWidth - width;
        width = minWidth;
      }
      valObj.columns[realIndex].w = width;

    }
    valObj.totalWidthUsed = 100 + remainingPercentageToAdd;

    return valObj;
  },
  validatorAdjustRowOverflows(valObj){

  },
  validatorMinimizeOverflows(columns, valObj){

  },


  // ======================================================
  // Render methods
  // ======================================================
  render(){
    var columns = null;
    if(this.state.columns){
      columns = this.state.columns.map(function(column, i){
        return <Grid.Column columnIndex={i} delegate={this} callGridDelegate={this.callDelegate} key={"row-" + column.rows[0].id} data={column} />;
      }.bind(this));
    }
    var className = 'sw-resizeable-grid';
    if(this.state.isResizing){
      className += ' sw-grid-resizing';
    }
    return (
      <div ref="grid" className={className}>
        {columns}
      </div>
    )
  },

  // ======================================================
  // Resizing
  // ======================================================
  columnWillResize(columnIndex){
    this.resizingColumnIndex = columnIndex;
    this.resizingSavedPercentages = this.columnsArrayPercentages();
    this.setState({isResizing: true});
  },
  rowWillResize(columnIndex, rowIndex){
    this.resizingSavedPercentages = this.rowsArrayPercentages(columnIndex);
    this.resizingColumnIndex = columnIndex;
    this.resizingRowIndex = rowIndex;
    this.setState({isResizing: true});
  },
  rowDidResize(){
    this.columnDidResize();
  },

  columnDidResize(){
    var obj = JSON.parse(JSON.stringify(this.state.columns));
    this.callDelegate('gridDidUpdate', obj);
    this.setState({isResizing: false});
  },

  columnResize(diffX){

    var percentages = this.columnsArrayPercentages();
    var percentageToMove = Math.abs(this.percentageWidthFromPixels(diffX));
    var minWidths = this.minWidthsForColumns();

    // Moving column, (diff < 0) means it should reverse the order it goes through the tiles.
    var newPercentages = this._moveWithPercentages(percentages, minWidths, percentageToMove, this.resizingColumnIndex, (diffX < 0));

    this.saveColumnPercentagesToState(newPercentages);
  },
  rowResize(diffY){
    var colI = this.resizingColumnIndex;
    var percentages = this.rowsArrayPercentages(colI);
    var percentageToMove = Math.abs(this.percentageHeightFromPixels(diffY));
    var minHeights = this.minHeightsForRowsInColumn(colI);
    var newPercentages = this._moveWithPercentages(percentages, minHeights, percentageToMove, this.resizingRowIndex, (diffY < 0));
    // Add percentages to rows and check if 100%
    this.saveRowPercentagesToState(colI, newPercentages);
  },

  // ======================================================
  // Main Resize function to calculate the layout
  // ======================================================
  _moveWithPercentages(percentages, minSizes, percentageToMove, index, reverse){
    if(reverse){
      index = this.reverseIndexFromArray(index, percentages) + 1; // Add to move on the right side of resizebar.
    }
    var prevIndex = index - 1;


    var remainingPercentageToAdd = percentageToMove;
    var remainingPercentageToRemove = percentageToMove;

    var newPercentages = [];

    for(var i = 0 ; i < percentages.length ; i++){
      // The realIndex is to make sure we don't mess up the order of the data when reversing.
      var realIndex = i;
      if(reverse){
        realIndex = this.reverseIndexFromArray(i, percentages);
      }
      var percentage = percentages[realIndex];
      var orgPercentage = this.resizingSavedPercentages[realIndex];

      var minSize = minSizes[realIndex];

      // All rows before the one that is connected to the resizer
      if(i < prevIndex){
        // Check if row was moved out earlier
        if(percentage < orgPercentage){
          // If
          percentage = this.roundedDecimal(percentage + remainingPercentageToAdd);
          remainingPercentageToAdd = 0;
          if(percentage > orgPercentage){
            remainingPercentageToAdd = percentage - orgPercentage;
            percentage = orgPercentage;
          }

        }
      }
      if(i === prevIndex){
        percentage = this.roundedDecimal(percentage + remainingPercentageToAdd);
      }
      if(i >= index){
        percentage = this.roundedDecimal(percentage - remainingPercentageToRemove);
        remainingPercentageToRemove = 0;
        if(percentage < minSize){
          remainingPercentageToRemove = minSize - percentage;
          percentage = minSize;
        }
      }

      newPercentages.push(percentage);

    }

    if(reverse){
      newPercentages.reverse();
    }
    return newPercentages;
  },




  // ======================================================
  // Conversions
  // ======================================================
  reverseIndexFromArray(i, array){
    var highestIndex = array.length - 1;
    return highestIndex - i;
  },
  percentageWidthFromPixels(pixels){
    // K_TODO: Cache the width to not query grid all the time.
    const grid = this.refs.grid;
    const gw = grid.clientWidth;
    var percentage = (pixels / gw * 100);

    return this.roundedDecimal(percentage);
  },
  pixelsWidthFromPercentage(percentage){
    // K_TODO: Cache the width to not query grid all the time.
    const grid = this.refs.grid;
    const gw = grid.clientWidth;
    return Math.round(gw / 100 * percentage);
  },
  percentageHeightFromPixels(pixels){
    // K_TODO: Cache the height to not query grid all the time.
    const grid = this.refs.grid;
    const gh = grid.clientHeight;
    var percentage = (pixels / gh * 100);

    return this.roundedDecimal(percentage);
  },
  pixelsHeightFromPercentage(percentage){
    // K_TODO: Cache the height to not query grid all the time.
    const grid = this.refs.grid;
    const gh = grid.clientHeight;
    return Math.round(gh / 100 * percentage);
  },
  roundedDecimal(number){
    return Math.round( number * 1e9 ) / 1e9;
  },


  // ======================================================
  // Calculations
  // ======================================================
  calcScale(gw, gh, rw, rh) {

    var curSizeX = 100;
    if(rw < gw){
      curSizeX = (rw * 100) / gw;
    }
    var curSizeY = 100;
    if (rh < gw) {
      curSizeY = (rh * 100) / gh;
    }
    var sizeToBe = {
      w: 100 / curSizeX,
      h : 100 / curSizeY
    };

    return sizeToBe
  },
  calcMinimizeHorizontalScale(currentColWidth) { // Scale col that is being minimized
    const minimizedSize = 40;
    const minimizedSizePercentages = ((minimizedSize * 100) / currentColWidth) / 100;

    return minimizedSizePercentages;
  },
  calcMinimizeVerticalScale(currentRowHeight) { // Scale row that is being minimized
    const minimizedSize = 40;
    const minimizedSizePercentages = ((minimizedSize * 100) / currentRowHeight) / 100;

    return minimizedSizePercentages;
  },
  calcMinimizeSiblingHorizontalScale(prevColumnEl, currentColWidth) { // Scale col that sibling of minimized col
    const prevColExpandWidth = prevColumnEl.clientWidth + currentColWidth - 40;
    const prevColExpandScale = ((prevColExpandWidth * 100) / prevColumnEl.clientWidth) / 100;

    return prevColExpandScale;
  },
  calcMinimizeSiblingVerticalScale(prevRowEl, currentRowHeight) { // Scale row that sibling of minimized row
    const prevRowExpandHeight = prevRowEl.clientHeight + currentRowHeight - 40;
    const prevRowExpandScale = ((prevRowExpandHeight * 100) / prevRowEl.clientHeight) / 100;

    return prevRowExpandScale;
  },

  // ======================================================
  // Setters
  // ======================================================
  saveColumnPercentagesToState(percentages, overflowI){
    var columns = this.state.columns;
    percentages.forEach(function(percent, i){
      columns[i].w = percent;
    });
    this.setState({columns: columns});

  },
  saveRowPercentagesToState(columnIndex, percentages, overflowI){
    var columns = this.state.columns;
    var rows = this.state.columns[columnIndex].rows;
    percentages.forEach(function(percent, i){
      rows[i].h = percent;
    })
    this.setState({columns: columns});

  },


  // ======================================================
  // Getters
  // ======================================================
  minWidthsForColumns(columns){
    var arr = [];
    if(!columns){
      columns = this.state.columns;
    }
    columns.forEach(function(column){
      var minWidth = DEFAULT_MINWIDTH;
      column.rows.forEach(function(row){
        if(row.minW && row.minW > minWidth){
          minWidth = row.minW;
        }
      });
      arr.push(this.percentageWidthFromPixels(minWidth));
    }.bind(this))
    return arr;
  },
  minHeightsForRows(columns){
    var res = {};
    if(!columns){
      columns = this.state.columns;
    }
    columns.forEach(function(column, colI){
      res[colI] = [];
      column.rows.forEach(function(row){
        var minHeight = DEFAULT_MINHEIGHT;
        if(row.minH && row.minH > minHeight){
          minHeight = row.minH;
        }
        res[colI].push(this.percentageHeightFromPixels(minHeight));
      }.bind(this));
      
    }.bind(this))

    return res;
  },
  minHeightsForRowsInColumn(columnIndex){
    var arr = [];
    this.state.columns[columnIndex].rows.forEach(function(row){
      var minHeight = DEFAULT_MINHEIGHT;
      if(row.minH && row.minH > minHeight){
        minHeight = row.minH;
      }
      arr.push(this.percentageHeightFromPixels(minHeight));
    }.bind(this))
    return arr;
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
  // Delegation Setup
  // ======================================================
  callDelegate(name){
    if(this.props.delegate && typeof this.props.delegate[name] === "function"){
      return this.props.delegate[name].apply(null, [this].concat(Array.prototype.slice.call(arguments, 1)));
    }
  },


  // ======================================================
  // Transitions handling
  // ======================================================
  onTransitionEnd(e){
    
    if(this.state.fullscreenTransition){
      
      if(e.target.id === "row-" + this.state.fullscreenTransition.id){
        console.log('on transition End', e.propertyName);
        var fullScreen = this.state.fullscreenTransition;
        this.setState({fullscreenTransition: null, fullscreen: fullScreen});
      }
      
    }
  },
  classesForColumn(columnIndex){
    var className = "";
    var fsTrans = this.state.fullscreenTransition || this.state.fullscreen;
    if(fsTrans && columnIndex === fsTrans.colIndex){
      if(this.state.fullscreen){
        className += " sw-fullscreen-column";
      }
      else {
        className += " sw-fullscreen-transition";
      }
    }
    return className;
  },
  classesForRow(columnIndex, rowIndex){
    var className = "";
    var fsTrans = this.state.fullscreenTransition || this.state.fullscreen;
    if(fsTrans && columnIndex === fsTrans.colIndex && rowIndex === fsTrans.rowIndex){
      if(this.state.fullscreen){
        className += " sw-fullscreen-row";
      }
      else {
        className += " sw-fullscreen-transition-row";
      }
      
    }
    
    return className;
  },
  transitionForColumn(columnIndex){
    var transitions = {};
    if(this.state.fullscreenTransition || this.state.fullscreen){
      var transObj = this.state.fullscreenTransition || this.state.fullscreen;
      var gw = this.refs.grid.clientWidth;
      if(transObj.colIndex != columnIndex){
        transitions.transformOrigin = "50% 50%";
        if(columnIndex < transObj.colIndex){
          transitions.transform = "translateX(" + (-transObj.rowPos.left) + "px)";
        }
        if(columnIndex > transObj.colIndex){
          transitions.transform = "translateX(" + (gw - transObj.rowPos.right) + 'px)';
        }
      }
    }
    return transitions;
  },
  transitionForRow(columnIndex, rowIndex){
    var transitions = {};
    var columns = this.state.columns;
    
    // Fullscreen transitions
    if(this.state.fullscreenTransition || this.state.fullscreen){
      var transObj = this.state.fullscreenTransition || this.state.fullscreen;
      var gh = this.refs.grid.clientHeight;
      var gw = this.refs.grid.clientWidth;

      if(transObj.colIndex === columnIndex){
        var numberOfRowsInColumn = columns[columnIndex].rows.length;
        if(rowIndex < transObj.rowIndex){
          transitions.transformOrigin = "50% 50%";
          transitions.transform = "translateY(" + (-transObj.rowPos.top) + "px)";
        }
        if(rowIndex > transObj.rowIndex){
          transitions.transformOrigin = "50% 50%";
          transitions.transform = "translateY(" + (gh - transObj.rowPos.bottom) + 'px)';
        }
        if(rowIndex === transObj.rowIndex && (!this.state.fullscreen || this.state.fullscreen.prepareScaleDown)){
          const centerXPercentage = (transObj.rowPos.left * 100) / ((gw - transObj.rowPos.right) + transObj.rowPos.left);
          const centerYPercentage = (transObj.rowPos.top * 100) / ((gh - transObj.rowPos.bottom) + transObj.rowPos.top);
          const scaleTo = this.calcScale(gw, gh, transObj.rowSize.width, transObj.rowSize.height);

          var originX = centerXPercentage;
          
          if(columnIndex === 0) 
            originX = 0;
          if(columnIndex === columns.length - 1)
            originX = 100;

          var originY = centerYPercentage;
          if(rowIndex === 0 && numberOfRowsInColumn === 1)
            originY = 50;
          else if(rowIndex === 0)
            originY = 0;
          else if(rowIndex === numberOfRowsInColumn - 1)
            originY = 100;
          

          transitions.transformOrigin = originX + '% ' + originY + '%';
          transitions.transform = 'scaleX(' + scaleTo.w + ') scaleY(' + scaleTo.h + ')';
        }
      }
    }
    if(this.state.fullscreen && columnIndex === this.state.fullscreen.colIndex && rowIndex === this.state.fullscreen.rowIndex){
      if(!this.state.fullscreen.prepareScaleDown){
        transitions.marginLeft = -this.state.fullscreen.rowPos.left + 'px';
        transitions.marginTop = -this.state.fullscreen.rowPos.top + 'px';
        transitions.position = "absolute";
        transitions.width = this.refs.grid.clientWidth + 'px';
        transitions.height = '100%';
      }
    }
    if(this.state.fullscreen && columnIndex === this.state.fullscreen.colIndex && rowIndex > this.state.fullscreen.rowIndex){
      if(!this.state.fullscreen.prepareScaleDown){
        transitions.marginTop = this.state.fullscreen.rowSize.height + 'px';
      }
    }
    return transitions;
  },


  // ======================================================
  // Custom Props Handlers
  // ======================================================
  onFullscreen(id){
    this._onFullscreenClick(id);
  },
  _onFullscreenClick(id){
    console.log('clicked fullscreen', id);
    if(this.state.fullscreen){
      var fullscreen = this.state.fullscreen;
      fullscreen.prepareScaleDown = true;
      this.setState({fullscreen: fullscreen});
      setTimeout(function(){
        this.setState({fullscreen: null});
      }.bind(this), 1);
      return;
    }
    var colIndex, rowIndex, foundRow;
    this.state.columns.forEach(function(column, colI){
      column.rows.forEach(function(row, rowI){
        if(row.id === id){
          colIndex = colI;
          rowIndex = rowI;
          foundRow = true;
        }
      });
    });
    var rowEl = document.getElementById('row-'+ id);
    var colEl = rowEl.parentNode;
    var fullscreenTransition = {
      rowIndex: rowIndex,
      colIndex: colIndex,
      id: id,
      rowPos: {
        left: colEl.offsetLeft,
        top: rowEl.offsetTop,
        right: colEl.offsetLeft + rowEl.clientWidth,
        bottom: rowEl.offsetTop + rowEl.clientHeight
      },
      rowSize: {
        width: rowEl.clientWidth,
        height: rowEl.clientHeight
      }
    };
    this.setState({"fullscreenTransition": fullscreenTransition});
  },
  onCollapse(id){

  },
  onReorderStart(id){

  },
  onReorder(){

  },
  onReorderEnd(){

  },

  // ======================================================
  // Maximize row
  // ======================================================
  minimizeColumnWithRow(row, columnIndex, rowIndex) {
    const that = this;
    const columns = this.state.columns;
    let currentColWidth = 0;
    let currentRowHeight = 0;
    let rowsLength = 0;

    // if column:not(first-child) transOrigin 0% 50%; else 100% 50%
    // if row:not(first-child) transOrigin 50% 100% else 50% 100%

    // translateX for minimized rowHeight - minimizedSize;

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



Grid.Column = React.createClass({
  renderResizer(){
    if(this.props.columnIndex > 0){
      return <Grid.Resizer columnIndex={this.props.columnIndex} delegate={this.props.delegate} />;
    }
  },
  render(){
    var data = this.props.data;
    // Find transitions for style from grid, if any.
    var styles = this.props.delegate.transitionForColumn(this.props.columnIndex) || {};
    styles.width = data.w + '%';
    

    var rows = data.rows.map(function(row, i){
      return <Grid.Row columnIndex={this.props.columnIndex} rowIndex={i} delegate={this.props.delegate} callGridDelegate={this.props.callGridDelegate} data={row} key={"row-" + row.id }/>;
    }.bind(this));

    var className = "sw-resizeable-column";
    var classes = this.props.delegate.classesForColumn(this.props.columnIndex);
    if(classes && classes.length)
      className += " " + classes;

    return (
      <div id={"column-" + this.props.columnIndex} onTransitionEnd={this.props.delegate.onTransitionEnd} className={className} style={styles}>
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
  render(){
    const {
      data
    } = this.props;
    
    var styles = {
      height: data.h + '%'
    };
    var transitions = this.props.delegate.transitionForRow(this.props.columnIndex, this.props.rowIndex);
    if(transitions){
      styles = Object.assign(styles, transitions);
    }

    var child = this.props.callGridDelegate('renderGridRowForId', data.id);

    var className = "sw-resizeable-row";
    if(data.collapsed){
      className += " sw-row-collapsed";
    }
    var classes = this.props.delegate.classesForRow(this.props.columnIndex, this.props.rowIndex);
    if(classes && classes.length)
      className += " " + classes;

    return (
      <div className={className} onTransitionEnd={this.props.delegate.onTransitionEnd} id={"row-" + data.id } ref="row" style={styles}>
        {this.renderResizer()}
        <div className="sw-row-content">{child}</div>
      </div>
    )
  }
});
module.exports = Grid;
