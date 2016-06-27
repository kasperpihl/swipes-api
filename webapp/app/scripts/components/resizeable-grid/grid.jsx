var React = require('react');
var DEFAULT_MINWIDTH = 400;
var DEFAULT_MINHEIGHT = 200;
var DEFAULT_COLLAPSED_WIDTH = 40;
var DEFAULT_COLLAPSED_HEIGHT = 40;
var Column = require('./grid_column');
var helper = require('./helper');

// define the steps of transitions here.
var TRANSITIONS_STEPS = {
  fullscreen: ["rippleStart", "scalingUp", "isFullscreen", "rippleEnd", "beforeScaleDown", "scalingDown", "removeRipple"],
  collapse: ["overlayIn", "scaling", "afterScaling", "overlayOut"],
  expand: ["overlayIn", "scaling", "afterScaling", "overlayOut"]
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
    var colI = this.resizingColumnIndex;
    var columns = this.state.columns;
    var orgPercentages = this.resizingSavedPercentages;
    var minHeights = this.minHeightsForRowsInColumn(colI);
    columns[colI].rows.forEach(function(row, i){
      if(row.h === this.percentageHeightFromPixels(DEFAULT_COLLAPSED_HEIGHT)){
        row.h = orgPercentages[i];
        row.collapsed = true;
      }
      else if(row.h < minHeights[i]){
        // Should animate!
        row.h = orgPercentages[i];
        row.collapsed = true;
      }
    }.bind(this));
    this.setState({colums: this.validateColumns(columns)});
    var obj = JSON.parse(JSON.stringify(this.state.columns));
    this.callDelegate('gridDidUpdate', obj);
    this.setState({isResizing: false});
  },

  columnDidResize(){
    var columns = this.state.columns;
    var orgPercentages = this.resizingSavedPercentages;
    var minWidths = this.minWidthsForColumns();
    columns.forEach(function(column, i){
      if(column.w === this.percentageWidthFromPixels(DEFAULT_COLLAPSED_WIDTH)){
        column.w = orgPercentages[i];
        column.rows.forEach(function(row, i){
          row.collapsed = true;
        });
      }
      else if(column.w < minWidths[i]){
        // Should animate!
        column.w = orgPercentages[i];
        column.rows.forEach(function(row, i){
          row.collapsed = true;
        });
      }
    }.bind(this));
    this.setState({colums: this.validateColumns(columns)});
    var obj = JSON.parse(JSON.stringify(this.state.columns));
    this.callDelegate('gridDidUpdate', obj);
    this.setState({isResizing: false});
  },

  columnResize(diffX){

    var percentages = this.columnsArrayPercentages();

    var options = { 
      minSizes: this.minWidthsForColumns(), 
      percentageToMove: this.percentageWidthFromPixels(diffX), 
      index: this.resizingColumnIndex,
      collapsed: this.collapsedColumns(),
      collapsedSize: this.percentageWidthFromPixels(DEFAULT_COLLAPSED_WIDTH)
    };

    var newPercentages = this._moveWithPercentages(percentages, options);
    this.saveColumnPercentagesToState(newPercentages);
  },
  rowResize(diffY){
    var colI = this.resizingColumnIndex;
    var percentages = this.rowsArrayPercentages(colI);
    var options = { 
      minSizes: this.minHeightsForRowsInColumn(colI), 
      percentageToMove: this.percentageHeightFromPixels(diffY), 
      index: this.resizingRowIndex,
      collapsed: this.collapsedRowsInColumn(colI),
      collapsedSize: this.percentageHeightFromPixels(DEFAULT_COLLAPSED_HEIGHT)
    };    
    var newPercentages = this._moveWithPercentages(percentages, options);
    this.saveRowPercentagesToState(colI, newPercentages);
  },
  // ======================================================
  // Main Resize function to calculate the layout
  // ======================================================
  /*
    minSizes, 
    collapsed, 
    collapsedSize, 
    percentageToMove, 
    index
   */
  _moveWithPercentages(percentages, options){

    var overflow = this.state.resizingOverflow;
    var diff = options.percentageToMove;
    var reverse = (diff < 0);
    
    
    if(overflow){
      var newOverflow = overflow + diff;
      diff = 0;
      if( (overflow < 0 && newOverflow > 0) || (overflow > 0 && newOverflow < 0)){
        diff = newOverflow;
        newOverflow = 0;
      }
      this.setState({resizingOverflow: newOverflow});
      if(!diff){
        return percentages;
      }
    }

    if(reverse){
      options.index = this.reverseIndexFromArray(options.index, percentages) + 1; // Add to move on the right side of resizebar.
      percentages.reverse();
    }
    var prevIndex = options.index - 1;

    var realIndex = function(i){
      if(reverse){
        return this.reverseIndexFromArray(i, percentages);
      }
      return i;
    }.bind(this);

    var remainingPercentageToRemove = Math.abs(diff);
    // Push all later to their min widths
    helper.findNeighbor(percentages, {index: prevIndex, rightOnly: true}, function(percentage, i) {
      if( !remainingPercentageToRemove || options.collapsed[realIndex(i)] )
        return false;
      
      var minSize = options.minSizes[ realIndex(i) ];
      percentage = this.roundedDecimal(percentage - remainingPercentageToRemove);
      remainingPercentageToRemove = 0;
      if( percentage < minSize ) {
        remainingPercentageToRemove = minSize - percentage;
        percentage = minSize;
      }
      percentages[i] = percentage;
      return false;
    }.bind(this));

    // Start collapsing from the furthest end
    if(remainingPercentageToRemove){
      helper.findNeighbor(percentages, {index: prevIndex, rightOnly: true, furthest: true}, function(percentage, i){
        if( !remainingPercentageToRemove || ( i !== options.index && options.collapsed[ realIndex(i) ]) )
          return false;

        percentage = this.roundedDecimal(percentage - remainingPercentageToRemove);
        remainingPercentageToRemove = 0;
        if( percentage < options.collapsedSize ) {
          remainingPercentageToRemove = options.collapsedSize - percentage;
          percentage = options.collapsedSize;
        }
        percentages[i] = percentage;
      }.bind(this));
    }

    // Check for overflow
    var overflow = remainingPercentageToRemove * (reverse ? -1 : 1);
    if(overflow){
      this.setState({resizingOverflow: overflow});
    }

    var remainingPercentageToAdd = Math.abs(diff) - remainingPercentageToRemove;
    
    
    // Add to all previous up to the original size they had
    helper.findNeighbor(percentages, {index: prevIndex, leftOnly: true, furthest: true}, function(percentage, i){
      if( !remainingPercentageToAdd || ( i !== options.index && options.collapsed[ realIndex(i) ]) )
        return false;

      var orgPercentage = this.resizingSavedPercentages[realIndex(i)];
      if( percentage < orgPercentage ) {
        percentage = this.roundedDecimal(percentage + remainingPercentageToAdd);
        remainingPercentageToAdd = 0;
        if(percentage > orgPercentage){
          remainingPercentageToAdd = percentage - orgPercentage;
          percentage = orgPercentage;
        }
        percentages[i] = percentage;
      }
    }.bind(this));

    // Add all remaining to the one right before the resizer
    if(remainingPercentageToAdd){
      percentages[prevIndex] += remainingPercentageToAdd;
    }

    if(reverse){
      percentages.reverse();
    }
    return percentages;
  },


  // ======================================================
  // Conversions
  // ======================================================
  reverseIndexFromArray(i, array){
    var highestIndex = array.length - 1;
    return highestIndex - i;
  },
  percentageWidthFromPixels(pixels){
    const gw = this.refs.grid.clientWidth;
    var percentage = (pixels / gw * 100);
    return this.roundedDecimal(percentage);
  },
  pixelsWidthFromPercentage(percentage){
    const gw = this.refs.grid.clientWidth;
    return Math.round(gw / 100 * percentage);
  },
  percentageHeightFromPixels(pixels){
    const gh = this.refs.grid.clientHeight;
    var percentage = (pixels / gh * 100);
    return this.roundedDecimal(percentage);
  },
  pixelsHeightFromPercentage(percentage){
    const gh = this.refs.grid.clientHeight;
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
  collapsedColumns(columns){
    var arr = [];
    if(!columns){
      columns = this.state.columns;
    }
    columns.forEach(function(column){
      arr.push((column.collapsed));
    }.bind(this))
    return arr;
  },
  collapsedRowsInColumn(columnIndex){
    var arr = [];
    this.state.columns[columnIndex].rows.forEach(function(row){
      arr.push((row.collapsed));
    }.bind(this))
    return arr;
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
      var newTransition = null;
      if(transition._currentIndex < lastIndex){
        transition._currentIndex++;
        transition.step = TRANSITIONS_STEPS[transition.name][transition._currentIndex];
        step = transition.step;
        newTransition = transition;
      }

      this.setState({transition: newTransition});
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
    var column = columns[colIndex];
    var classes = [];

    var styles = {};
    if(trans.name === "collapse"){
      
      if(trans.info.affectedCol){ // Collapsing the column.
        var collapsedWidth = this.percentageWidthFromPixels(DEFAULT_COLLAPSED_WIDTH);
        var diff = trans.info.col.width - collapsedWidth;
        var affectedWidth = trans.info.affectedCol.width;
        if(trans.info.col.i === colIndex){
          classes.push("sw-collapse-column");
          if(trans.step === "scaling"){
            styles.transformOrigin = (trans.info.col.i > trans.info.affectedCol.i) ? '100% 50%' : '0% 50%';
            styles.transform = 'scaleX(' + helper.calcScale(trans.info.col.width, collapsedWidth) + ')';
          }
        }
        // Collapsed columns in between the affected and the row
        if( ( colIndex > trans.info.col.i && colIndex < trans.info.affectedCol.i ) ||
          ( colIndex < trans.info.col.i && colIndex > trans.info.affectedCol.i ) ) {

          var translateX = this.pixelsWidthFromPercentage(diff);
          if(colIndex > trans.info.col.i)
            translateX = -translateX;
          if(trans.step === "scaling"){
            styles.transformOrigin = "50% 50%";
            styles.transform = 'translateX(' + translateX + 'px)';
          } 
        }

        if(trans.info.affectedCol.i === colIndex){
          classes.push("sw-collapse-affected-column");
          if(trans.step === "scaling"){
            styles.transformOrigin = (trans.info.col.i > trans.info.affectedCol.i) ? '0% 50%' : '100% 50%';
            styles.transform = 'scaleX(' + helper.calcScale(affectedWidth, affectedWidth + diff) + ')';
          }
        }
      }

    }

    if(trans.name === "expand"){
      
      if(trans.info.affectedCol){ // Collapsing the column.
        var collapsedWidth = this.percentageWidthFromPixels(DEFAULT_COLLAPSED_WIDTH);
        var diff = trans.info.col.width - collapsedWidth;
        var affectedWidth = trans.info.affectedCol.width;
        if(trans.info.col.i === colIndex){
          classes.push("sw-expand-column");
          if(trans.step === "scaling"){
            styles.transformOrigin = (trans.info.col.i > trans.info.affectedCol.i) ? '100% 50%' : '0% 50%';
            styles.transform = 'scaleX(' + helper.calcScale(collapsedWidth, trans.info.col.width) + ')';
          }
        }
        // Collapsed columns in between the affected and the row
        if( ( colIndex > trans.info.col.i && colIndex < trans.info.affectedCol.i ) ||
          ( colIndex < trans.info.col.i && colIndex > trans.info.affectedCol.i ) ) {

          var translateX = this.pixelsWidthFromPercentage(diff);
          if(colIndex > trans.info.col.i)
            translateX = -translateX;
          if(trans.step === "scaling"){
            styles.transformOrigin = "50% 50%";
            styles.transform = 'translateX(' + translateX + 'px)';
          } 
        }

        if(trans.info.affectedCol.i === colIndex){
          classes.push("sw-expand-affected-column");
          if(trans.step === "scaling"){
            styles.transformOrigin = (trans.info.col.i > trans.info.affectedCol.i) ? '0% 50%' : '100% 50%';
            styles.transform = 'scaleX(' + helper.calcScale(affectedWidth, affectedWidth - diff) + ')';
          }
        }
      }

    }
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
    if(trans.name === "collapse"){
      if(trans.info.col.i === colIndex){
        if(trans.info.row.i === rowIndex){
          classes.push('sw-collapse-row');
        }
        if(trans.info.affectedRow){
          var collapsedHeight = this.percentageHeightFromPixels(DEFAULT_COLLAPSED_HEIGHT);
          var diff = trans.info.row.height - collapsedHeight;
          var affectedHeight = trans.info.affectedRow.height;
          if(trans.info.row.i === rowIndex){
            if(trans.step === "scaling"){
              styles.transformOrigin = (trans.info.row.i > trans.info.affectedRow.i) ? '50% 100%' : '50% 0%';
              styles.transform = 'scaleY(' + helper.calcScale(trans.info.row.height, collapsedHeight) + ')';
            }
          }
           // Collapsed columns in between the affected and the row
          if( ( rowIndex > trans.info.row.i && rowIndex < trans.info.affectedRow.i ) ||
            ( rowIndex < trans.info.row.i && rowIndex > trans.info.affectedRow.i ) ) {

            var translateY = this.pixelsHeightFromPercentage(diff);
            if(rowIndex > trans.info.row.i)
              translateY = -translateY;
            if(trans.step === "scaling"){
              styles.transformOrigin = "50% 50%";
              styles.transform = 'translateY(' + translateY + 'px)';
            } 
          }
          if(trans.info.affectedRow.i === rowIndex){
            classes.push("sw-collapse-affected-row");
            if(trans.step === "scaling"){
              styles.transformOrigin = (trans.info.row.i > trans.info.affectedRow.i) ? '50% 0%' : '50% 100%';
              styles.transform = 'scaleY(' + helper.calcScale(affectedHeight, affectedHeight + diff) + ')';
            }
          }
        }
      }
    }
    if(trans.name === "expand"){
      if(trans.info.col.i === colIndex){
        if(trans.info.row.i === rowIndex){
          classes.push('sw-expand-row');
        }
        if(trans.info.affectedRow){
          var collapsedHeight = this.percentageHeightFromPixels(DEFAULT_COLLAPSED_HEIGHT);
          var diff = trans.info.row.height - collapsedHeight;
          var affectedHeight = trans.info.affectedRow.height;
          if(trans.info.row.i === rowIndex){
            if(trans.step === "scaling"){
              styles.transformOrigin = (trans.info.row.i > trans.info.affectedRow.i) ? '50% 100%' : '50% 0%';
              styles.transform = 'scaleY(' + helper.calcScale(collapsedHeight, trans.info.row.height) + ')';
            }
          }
           // Collapsed columns in between the affected and the row
          if( ( rowIndex > trans.info.row.i && rowIndex < trans.info.affectedRow.i ) ||
            ( rowIndex < trans.info.row.i && rowIndex > trans.info.affectedRow.i ) ) {

            var translateY = this.pixelsHeightFromPercentage(diff);
            if(rowIndex < trans.info.row.i)
              translateY = -translateY;
            if(trans.step === "scaling"){
              styles.transformOrigin = "50% 50%";
              styles.transform = 'translateY(' + translateY + 'px)';
            } 
          }
          if(trans.info.affectedRow.i === rowIndex){
            classes.push("sw-expand-affected-row");
            if(trans.step === "scaling"){
              styles.transformOrigin = (trans.info.row.i > trans.info.affectedRow.i) ? '50% 0%' : '50% 100%';
              styles.transform = 'scaleY(' + helper.calcScale(affectedHeight, affectedHeight - diff) + ')';
            }
          }
        }
      }
    }
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


  // ======================================================
  // Custom Props Handlers
  // ======================================================
  onMenuButton(id){
    this.callDelegate('gridRowPressedMenu', id);
  },
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
  onExpand(id){
    this._onExpandClick(id);
  },
  
  _onCollapseClick(id){
    var indexes = this.indexesForRowId(id);
    var affectedColI = helper.findNeighbor(this.state.columns, {index: indexes.col, returnIndex: true}, function(column, i){
      return (!column.collapsed);
    })
    console.log('closest col', affectedColI);
    var affectedColumn = this.state.columns[affectedColI];
    var column = this.state.columns[indexes.col];
    
    var row = column.rows[indexes.row];
    var transitionInfo = {
      col: {
        i: indexes.col,
        width: column.w
      },
      row: {
        i: indexes.row,
        height: row.h
      }
    }


    var affectedRowI = helper.findNeighbor(column.rows, {index: indexes.row, returnIndex: true}, function(row, i){
      return (!row.collapsed);
    });
    console.log('closest row', affectedRowI);
    if(affectedRowI > -1){
      var affectedRow = column.rows[affectedRowI];
      transitionInfo.affectedRow = {
        i: affectedRowI,
        height: affectedRow.h
      };
    } else {
      transitionInfo.affectedCol = {
        i: affectedColI,
        width: affectedColumn.w
      }
    }


    this.transitionStart("collapse", transitionInfo, function(step){
      var timer = 0;
      switch(step){
        case "overlayIn":
          timer = 100;
          break;
        case "scaling":
          timer = 250;
          break;
        case "afterScaling":
          timer = 1;
          break;
        case "overlayOut":
          timer = 300;
          break;
      }

      if(timer){
        setTimeout(function(){
          this.transitionNext();
        }.bind(this), timer);
      }


      if(step === "afterScaling" && transitionInfo.affectedCol){
        var collapsedWidth = this.percentageWidthFromPixels(DEFAULT_COLLAPSED_WIDTH);
        var newAffectedWidth = affectedColumn.w + (column.w - collapsedWidth);
        var columns = this.state.columns;
        columns[indexes.col].rows[indexes.row].collapsed = true;
        columns[affectedColI].w = newAffectedWidth;
        this.setState({columns: this.validateColumns(columns)}); 
      }
      else if(step === "afterScaling" && transitionInfo.affectedRow){
        var collapsedHeight = this.percentageHeightFromPixels(DEFAULT_COLLAPSED_HEIGHT);
        var newAffectedHeight = transitionInfo.affectedRow.height + (transitionInfo.row.height - collapsedHeight);
        var columns = this.state.columns;
        columns[indexes.col].rows[indexes.row].collapsed = true;
        columns[indexes.col].rows[affectedRowI].h = newAffectedHeight;
        this.setState({columns: this.validateColumns(columns)}); 
      }
    }.bind(this));
  },
  _onExpandClick(id){
    var indexes = this.indexesForRowId(id);
    var affectedColI = helper.findNeighbor(this.state.columns, {index: indexes.col, returnIndex: true}, function(column, i){
      return (!column.collapsed);
    })
    var affectedColumn = this.state.columns[affectedColI];
    var column = this.state.columns[indexes.col];
    
    var row = column.rows[indexes.row];
    var transitionInfo = {
      col: {
        i: indexes.col,
        width: column.w
      },
      row: {
        i: indexes.row,
        height: row.h
      }
    }

    var affectedRowI = helper.findNeighbor(column.rows, {index: indexes.row, returnIndex: true}, function(row, i){
      return (!row.collapsed);
    });
    if(affectedRowI > -1){
      var affectedRow = column.rows[affectedRowI];
      transitionInfo.affectedRow = {
        i: affectedRowI,
        height: affectedRow.h
      };
    } else {
      transitionInfo.affectedCol = {
        i: affectedColI,
        width: affectedColumn.w
      }
    }


    this.transitionStart("expand", transitionInfo, function(step){
      var timer = 0;
      switch(step){
        case "overlayIn":
          timer = 100;
          break;
        case "scaling":
          timer = 250;
          break;
        case "afterScaling":
          timer = 1;
          break;
        case "overlayOut":
          timer = 300;
          break;
      }

      if(timer){
        setTimeout(function(){
          this.transitionNext();
        }.bind(this), timer);
      }

      if(step === "afterScaling" && transitionInfo.affectedCol){
        var collapsedWidth = this.percentageWidthFromPixels(DEFAULT_COLLAPSED_WIDTH);
        var newAffectedWidth = affectedColumn.w - (column.w - collapsedWidth);
        var columns = this.state.columns;
        columns[indexes.col].rows[indexes.row].collapsed = false;
        columns[affectedColI].w = newAffectedWidth;
        console.log('affectedWidth', newAffectedWidth);
        this.setState({columns: this.validateColumns(columns)}); 
      }
      else if(step === "afterScaling" && transitionInfo.affectedRow){
        var collapsedHeight = this.percentageHeightFromPixels(DEFAULT_COLLAPSED_HEIGHT);
        var newAffectedHeight = transitionInfo.affectedRow.height - (transitionInfo.row.height - collapsedHeight);
        var columns = this.state.columns;
        columns[indexes.col].rows[indexes.row].collapsed = false;
        columns[indexes.col].rows[affectedRowI].h = newAffectedHeight;
        this.setState({columns: this.validateColumns(columns)}); 
      }
    }.bind(this));
  }
});

module.exports = Grid;