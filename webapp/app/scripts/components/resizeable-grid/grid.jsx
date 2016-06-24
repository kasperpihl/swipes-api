var React = require('react');
var DEFAULT_MINWIDTH = 200;
var DEFAULT_MINHEIGHT = 200;
var DEFAULT_COLLAPSED_WIDTH = 40;
var DEFAULT_COLLAPSED_HEIGHT = 40;
var Column = require('./grid_column');

// define the steps of transitions here.
var TRANSITIONS_STEPS = {
  fullscreen: ["rippleStart", "scalingUp", "isFullscreen", "rippleEnd", "beforeScaleDown", "scalingDown", "removeRipple"],
  collapsing: [],
  expanding: []
};
// Helper function to make animation states more readable, "test".indexOf("hey", "there", "test") === true
String.prototype.isOneOf = function(){
  var args = Array.prototype.slice.call(arguments);
  return (args.indexOf(this.toString()) > -1);
};

var Grid = React.createClass({
  // ======================================================
  // Life Cycle methods
  // ======================================================
  getInitialState() {
    return {};
  },
  componentDidMount() {
      this.debug = false;
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
      [X] initialDetermination // check if columns have widths and rows have height
      [ ] assignWidthsAndHeights // If heights/widths were missing, assign them.
      [ ] adjustOverflows // If size is too big/small, adjust it
      [ ] determineAnimations
    */

    // Validation object, passed along the different validation functions and returned with updated values.
    var valObj = {
      columns: columns,
      minWidths: this.minWidthsForColumns(columns), // Array with minWidths as values []
      collapsedWidth: this.percentageWidthFromPixels(DEFAULT_COLLAPSED_WIDTH),
      collapsedHeight: this.percentageHeightFromPixels(DEFAULT_COLLAPSED_HEIGHT),
      minHeights: this.minHeightsForRows(columns),
      totalWidthUsed: 0
    };
    valObj = this.validatorPropertiesOfColumns(valObj);

    valObj = this.validatorInitialColumnDetermination(valObj);
    if(this.debug) console.log('did initial column determination', valObj);

    valObj = this.validatorInitialRowDetermination(valObj);
    if(this.debug) console.log('did initial row determination', valObj);

    valObj = this.validatorAssignWidths(valObj);
    if(this.debug) console.log('did assign widths', valObj);

    valObj = this.validatorAssignHeights(valObj);
    if(this.debug) console.log('did assign heights', valObj);

    // If width used is different from 100 or a new column is here.
    if(Math.abs(valObj.totalWidthUsed - 100) > 0.01){
      valObj = this.validatorAdjustColumnOverflows(valObj);
      if(this.debug) console.log('did adjust column overflows', valObj);
    }

    valObj = this.validatorAdjustRowOverflows(valObj);
    if(this.debug) console.log('did adjust row overflow', valObj);

    return valObj.columns;
  },
  validatorPropertiesOfColumns(valObj){
    /*
      [] Check if all rows is collapsed and add/remove .collapsed on column
    */
    return valObj;
  },
  validatorInitialColumnDetermination(valObj){

    valObj.columnsHaveEqualWidth = true;
    valObj.columnsThatNeedWidth = [];
    valObj.collapsedColumns = [];
    var rowsThatNeedHeight = {}

    var testColumnWidth = 0;
    valObj.columns.forEach(function(column, colI){
      var colWidth = column.w ? column.w : 0;
      var isCollapsed = this.columnIsCollapsed(column);
      if(column.collapsed != isCollapsed){
        column.collapsed = isCollapsed;
      } 
      if(isCollapsed){
        colWidth = valObj.collapsedWidth;
        valObj.collapsedColumns.push(colI);
      }
      else if(colWidth){
        if(colI > 0 && colWidth != testColumnWidth){
          valObj.columnsHaveEqualWidth = false;
        }
        testColumnWidth = colWidth;
      }
      else{
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
        if(row.collapsed){
          rowHeight = DEFAULT_MINHEIGHT;
        }
        else if(rowHeight){
          if(rowI > 0 && rowHeight != testRowHeight){
            rowsHaveEqualHeight = false;
          }
          testRowHeight = rowHeight;
        }
        else {
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
      var numberOfNonCollapsedColumns = valObj.columns.length - valObj.collapsedColumns.length;
      if(column.collapsed) {
        valObj.totalWidthUsed += valObj.collapsedWidth;
      } else {
        if(valObj.columnsHaveEqualWidth){
          column.w = this.roundedDecimal((100 - valObj.collapsedColumns.length*valObj.collapsedWidth) / numberOfNonCollapsedColumns);
        }
        else if(valObj.columnsThatNeedWidth.indexOf(colI) > -1){
          column.w = minWidth;
        }
        column.w = Math.max(minWidth, column.w);
        valObj.totalWidthUsed += column.w;
      }

    }.bind(this));

    return valObj;
  },

  validatorAssignHeights(valObj){

    valObj.columns.forEach(function(column, colI){
      var totalHeight = 0;
      column.rows.forEach(function(row, rowI){
        var minHeight = valObj.minHeights[colI][rowI];
        if(row.collapsed && !column.collapsed){
          totalHeight += valObj.collapsedHeight;
        }
        else{
          if(valObj.columnsEqualRowHeight[colI]){
            row.h = this.roundedDecimal(100 / column.rows.length);
          }
          else if(valObj.rowsThatNeedHeight.indexOf(row.id) > -1){
            row.h = minHeight;
          }
          row.h = Math.max(minHeight, row.h);
          totalHeight += row.h;
        }
        
      }.bind(this));
      valObj.columnsTotalRowsHeight[colI] = totalHeight;
    }.bind(this));

    return valObj;
  },
  validatorAdjustColumnOverflows(valObj){
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
      var column = valObj.columns[realIndex];
      var minWidth = valObj.minWidths[realIndex];
      var width = column.w;
      if(!column.collapsed){
        width = width - remainingPercentageToAdd;
        
        remainingPercentageToAdd = 0;
        if(width < minWidth){
          remainingPercentageToAdd = minWidth - width;
          width = minWidth;
        }
        valObj.columns[realIndex].w = width;
      }
      

    }
    valObj.totalWidthUsed = 100 + remainingPercentageToAdd;

    return valObj;
  },
  validatorAdjustRowOverflows(valObj){
    var reverse = true; // K_TODO: make dynamic here

    
    valObj.columns.forEach(function(column, colI){

      var additionalHeight = valObj.columnsTotalRowsHeight[colI] - 100;
      var remainingPercentageToAdd = additionalHeight;

      for(var i = 0 ; i < column.rows.length ; i++){
        if(!remainingPercentageToAdd){
          break;
        }
        var realIndex = i;
        if(reverse){
          realIndex = this.reverseIndexFromArray(i, column.rows);
        }
        var row = column.rows[realIndex];
        var minHeight = valObj.minHeights[colI][realIndex];
        var height = row.h;
        if(!row.collapsed){

          height = height - remainingPercentageToAdd;
          
          remainingPercentageToAdd = 0;
          if(height < minHeight){
            remainingPercentageToAdd = minHeight - height;
            height = minHeight;
          }
          row.h = height;
        }
        

      }
      valObj.columnsTotalRowsHeight[colI] = 100 + remainingPercentageToAdd;

    }.bind(this));
    
    return valObj;
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
        return <Column columnIndex={i} delegate={this} callGridDelegate={this.callDelegate} key={"row-" + column.rows[0].id} data={column} />;
      }.bind(this));
    }
    var styles = {};
    var className = 'sw-resizeable-grid';
    if(this.state.isResizing){
      className += ' sw-grid-resizing';
    }
    var transitions = this.transitionForGrid();
    if(transitions){
      if(transitions.styles){
        styles = Object.assign(styles, transitions.styles);
      }
      if(transitions.classes.length){
        className += " " + transitions.classes.join(' ');
      }
    }
    return (
      <div ref="grid" className={className} styles={styles}>
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
  collapsedWidth(){
    return this.percentageWidthFromPixels(DEFAULT_COLLAPSED_WIDTH);
  },
  collapsedHeight(columnIndex){
    var column = this.state.columns[columnIndex];
    if(this.columnIsCollapsed(column)){
      return this.roundedDecimal(100 / column.rows.length);
    }
    return this.percentageHeightFromPixels(DEFAULT_COLLAPSED_HEIGHT);
  },
  columnIsCollapsed(column){
    var allRowsCollapsed = true;
    column.rows.forEach(function(row, i){
      if(!row.collapsed){
        allRowsCollapsed = false;
      }
    });
    return allRowsCollapsed;
  },
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
  rowFromId(id){
    var res;
    this.state.columns.forEach(function(column, colI){
      column.rows.forEach(function(row){
        if(row.id === id){
          res = row;
        }
      }.bind(this));

    }.bind(this))
    return res;
  },
  columnForIndex(index){
    var columns = this.state.columns;
    return columns[index];
  },
  indexesForRowId(id){
    var index = null;
    this.state.columns.forEach(function(column, colI){
      column.rows.forEach(function(row, rowI){
        if(row.id === id){
          index = {
            col: colI,
            row: rowI
          }
        }
      });
    });
    return index;
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
  // name, array of steps, optional index to start in the middle etc
  transitionStart(name, info, callback, index){
    var currentIndex = (index || 0) - 1;
    if(!TRANSITIONS_STEPS[name]){
      return new Error("transitionStart: unknown name");
    }
    var transition = {
      name: name,
      step: TRANSITIONS_STEPS[name][currentIndex],
      info: info,
      _currentIndex: currentIndex,
      _callback: callback
    };
    this.transitionNext(transition);
  },
  transitionNext(transition){
    if(!transition){
      transition = this.state.transition;
    }

    if(transition){
      var lastIndex = TRANSITIONS_STEPS[transition.name].length - 1;
      var step = null, callback = transition._callback;
      if(transition._currentIndex < lastIndex){
        transition._currentIndex++;
        transition.step = TRANSITIONS_STEPS[transition.name][transition._currentIndex];
        step = transition.step;
        this.setState({transition: transition});
      }
      else{
        // Make a queue for transitions to check if next one is up.
        this.setState({transition: null});
      }
      if(typeof callback === "function"){
        callback(step);
      }
      this.callDelegate('gridDidTransitionStep', transition.name, transition.step);
    }

  },

  onTransitionEnd(e){
    var trans = this.state.transition;
    if(!trans){
      return;
    }
    if(trans.name === "fullscreen"){
      if(e.target.classList.contains("transition-ripple")){
        if(trans.step === "rippleEnd"){
          this.transitionNext();
          setTimeout(function(){
            this.transitionNext();
          }.bind(this), 1);
        }
      }
      if(e.target.id === "row-" + trans.info.id){
        if(trans.step.isOneOf("scalingUp", "scalingDown")){
          this.transitionNext();
        }
      }
    }
  },
  transitionForGrid(){
    var trans = this.state.transition;
    if(!trans){
      return;
    }
    var classes = [];
    var styles = {};
    classes.push("sw-" + trans.name);
    classes.push("sw-" + trans.name + "-" + trans.step);

    return {styles: styles, classes: classes};
  },
  transitionForColumn(colIndex){
    var trans = this.state.transition;
    if(!trans){
      return;
    }
    var columns = this.state.columns;
    var classes = [];

    var styles = {};

    if(trans.name === "fullscreen"){
      if(trans.info.col === colIndex){ // The column with the row to fullscreen
        classes.push("sw-fullscreen-column");
      }
      else { // The columns without the row to fullscreen
        var gw = this.refs.grid.clientWidth;
        styles.transformOrigin = "50% 50%";
        if(colIndex < trans.info.col){
          if(trans.step.isOneOf("scalingUp","isFullscreen", "rippleEnd", "prepareScaleDown")){
            styles.transform = "translateX(" + (-trans.info.rowPos.left) + "px)";
          }
        }
        if(colIndex > trans.info.col){
          if(trans.step.isOneOf("scalingUp","isFullscreen", "rippleEnd", "prepareScaleDown")){
            styles.transform = "translateX(" + (gw - trans.info.rowPos.right) + 'px)';
          }
        }
      }
    }
    return {styles: styles, classes: classes};
  },
  transitionForRow(colIndex, rowIndex){
    var trans = this.state.transition;
    if(!trans){
      return;
    }
    var columns = this.state.columns;
    var classes = [];
    var styles = {};
    var rippleStyles = {};

    if(trans.name === "fullscreen"){
      if(trans.info.col === colIndex){

        var gh = this.refs.grid.clientHeight;
        var gw = this.refs.grid.clientWidth;
        if(rowIndex > trans.info.row){
          if(trans.step.isOneOf("scalingUp", "beforeScaleDown")){
            styles.transformOrigin = "50% 50%";
            styles.transform = "translateY(" + (gh - trans.info.rowPos.bottom) + 'px)';
          }
          if(trans.step.isOneOf("isFullscreen", "rippleEnd")){
            styles.display = 'none';
          }
        }
        if(rowIndex < trans.info.row){
          if(trans.step.isOneOf("scalingUp", "beforeScaleDown")){
            styles.transformOrigin = "50% 50%";
            styles.transform = "translateY(" + (-trans.info.rowPos.top) + "px)";
          }
          if(trans.step.isOneOf("isFullscreen", "rippleEnd")){
            styles.display = 'none';
          }
        }


        if(rowIndex === trans.info.row){
          classes.push("sw-fullscreen-row");

          if(trans.step.isOneOf("rippleStart", "scalingUp", "isFullscreen", "rippleEnd", "beforeScaleDown", "scalingDown", "removeRipple")){
            var rippleSize = 2 * Math.max(trans.info.rowSize.height, trans.info.rowSize.width);
            if(trans.step.isOneOf("isFullscreen", "rippleEnd")){
              rippleSize = 2 * Math.max(gw, gh);
            }
            rippleStyles.width = rippleSize + 'px';
            rippleStyles.height = rippleSize + 'px';
          }

          var numberOfRowsInColumn = columns[colIndex].rows.length;
          const centerXPercentage = (trans.info.rowPos.left * 100) / ((gw - trans.info.rowPos.right) + trans.info.rowPos.left);
          const centerYPercentage = (trans.info.rowPos.top * 100) / ((gh - trans.info.rowPos.bottom) + trans.info.rowPos.top);
          const scaleTo = this.calcScale(gw, gh, trans.info.rowSize.width, trans.info.rowSize.height);

          var originX = centerXPercentage;

          if(colIndex === 0)
            originX = 0;
          if(colIndex === columns.length - 1)
            originX = 100;

          var originY = centerYPercentage;
          if(rowIndex === 0 && numberOfRowsInColumn === 1)
            originY = 50;
          else if(rowIndex === 0)
            originY = 0;
          else if(rowIndex === numberOfRowsInColumn - 1)
            originY = 100;


          styles.transformOrigin = originX + '% ' + originY + '%';
          if(trans.step.isOneOf("scalingUp", "beforeScaleDown")){
            styles.transform = 'scaleX(' + scaleTo.w + ') scaleY(' + scaleTo.h + ')';
          }



          if(trans.step.isOneOf("isFullscreen", "rippleEnd")){
            styles.marginLeft = -trans.info.rowPos.left + 'px';
            styles.top = 0;
            styles.left = 0;
            styles.position = "absolute";
            styles.width = gw + 'px';
            styles.height = '100%';
          }

        }
      }
    } // End transition fullscreen
    return {styles: styles, classes: classes, rippleStyles: rippleStyles};
  },
  onResizeForOverlay() {
    const that = this;
    const minWidthPercentage = this.minWidthsForColumns();
    const columns = this.state.columns;
    let columnData = [];

    minWidthPercentage.forEach(function(minWidth) {
      const convertedMinWidth = that.pixelsWidthFromPercentage(minWidth);
      columnData.push({minWidth: convertedMinWidth});
    })

    columns.forEach(function(column, i) {
      const colWidth = that.pixelsWidthFromPercentage(column.w);
      columnData[i].width = colWidth;
    })

    if (columnData.length > 0) {
      columnData.forEach(function(column) {
        if (column.width === column.minWidth) {
          console.log('baller');
        }
      })
    }
  },
  realTransForCol(colI){

  },

  // ======================================================
  // Custom Props Handlers
  // ======================================================
  onFullscreen(id){
    this._onFullscreenClick(id);
  },
  _onFullscreenClick(id){
    console.log('clicked fullscreen', id);
    var trans = this.state.transition;

    // If fullscreen is already on, jump to prepareScaleDown and then scalingDown
    if(trans && trans.name === "fullscreen"){ // trans.step is "isFullscreen"
      this.transitionNext();
      return;
    }



    var indexes = this.indexesForRowId(id);
    var rowEl = document.getElementById('row-'+ id);
    var colEl = rowEl.parentNode;
    var transitionInfo = {
      row: indexes.row,
      col: indexes.col,
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
    this.transitionStart("fullscreen", transitionInfo, function(step){
      var columns = this.state.columns;
      if(step === "rippleStart" || step === "removeRipple"){
        setTimeout(function(){
          this.transitionNext();
        }.bind(this), 330);
      }
      if(!step || step === 'isFullscreen'){
        columns[indexes.col].rows[indexes.row].fullscreen = (step === 'isFullscreen');
        this.setState({columns: columns});
      }
      

    }.bind(this));
  },
  onCollapse(id){
    this._onCollapseClick(id);
  },
  _onCollapseClick(id){
    var row = this.rowFromId(id);
    var columns = this.state.columns;
    var indexes = this.indexesForRowId(id);
    
    var transformTo = true;
    if(row.collapsed){
      transformTo = false;
    }
    var transition = {

    };
    
    columns[indexes.col].rows[indexes.row].collapsed = transformTo;
    this.setState({columns: this.validateColumns(columns)});
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
    // if row:not(first-child) transOrigin 50% 0% else 50% 100%

  }
});

module.exports = Grid;
