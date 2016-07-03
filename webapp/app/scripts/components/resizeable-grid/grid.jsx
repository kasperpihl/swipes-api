var React = require('react');
var DEFAULT_MINWIDTH = 300;
var DEFAULT_MINHEIGHT = 200;
var DEFAULT_COLLAPSED_WIDTH = 40;
var DEFAULT_COLLAPSED_HEIGHT = 40;

var SHADOW_LEFT = 'inset 30px 0px 10px -10px  rgba(97,203,253,0.81)';
var SHADOW_RIGHT = 'inset -30px 0px 10px -10px  rgba(97,203,253,0.81)';
var SHADOW_TOP = 'inset 0px 30px 10px -10px  rgba(97,203,253,0.81)';
var SHADOW_BOTTOM = 'inset 0px -30px 10px -10px  rgba(97,203,253,0.81)';


var COLUMN_SIDE_HOVER_SIZE = 40;
var Column = require('./grid_column');
var helper = require('./helper');
var offset = require('document-offset');

// define the steps of transitions here.
var TRANSITIONS_STEPS = {
  fullscreen: [
    {n: "rippleStart", t: 330},
    {n: "scalingUp", t:250},
    "isFullscreen",
    {n: "rippleEnd", t: 100},
    {n: "beforeScaleDown", t: 1},
    {n: "scalingDown", t: 250},
    {n: "removeRipple", t: 330}
  ],
  collapse: [
    {n: "overlayIn", t: 100}, 
    {n: "scaling", t: 200}, 
    {n:"afterScaling", t: 1}, 
    {n: "overlayOut", t: 350}
  ],
  resizing: ["resizing"],
  reordering: ["reordering"]
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

      //this.transitionStart('reordering', {test:true});
      //this.refs.grid.addEventListener('mousemove', this._onMouseMove);
  },

  _onMouseMove(e){
    // Math to find out which row is hovered and where in the row...
    var gridPos = offset(this.refs.grid);
    var gridX = e.pageX - gridPos.left;
    var gridY = e.pageY - gridPos.top;
    var dX = 0;
    this.state.columns.forEach(function(column, cI){
      var width = this.pixelsWidthFromPercentage(column.w);
      if(gridX >= dX && gridX < (dX + width)){
        var dY = 0;
        column.rows.forEach(function(row, rI){
          var height = this.pixelsHeightFromPercentage(row.h);
          var extraY = gridY - dY;
          var extraX = gridX - dX;
          var info = {}
          if(gridY >= dY && gridY < (dY + height)){
            var trans = this.state.transition;
            if(extraY < height/2){
              trans.info.direction = 'top';
            }
            else{
              trans.info.direction = 'bottom';
            }
            if(extraX < COLUMN_SIDE_HOVER_SIZE){
              trans.info.direction = 'left';
            }
            else if(extraX > (width - COLUMN_SIDE_HOVER_SIZE)){
              trans.info.direction = 'right';
            }
            trans.info.col = cI;
            trans.info.row = rI;
            console.log('hover', cI, rI, trans.info.direction);
            this.setState({transition: trans});
          }
          dY += height;
        }.bind(this));
      }
      dX += width;
    }.bind(this));
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
    var transitionInfo = {
      col: columnIndex,
      resizingRow: false,
      savedPercentages: this.columnsArrayPercentages(),
      originallyCollapsed: []
    };
    var prevIndex = columnIndex - 1;
    var columns = this.state.columns;
    var collapsedWidth = this.percentageWidthFromPixels(DEFAULT_COLLAPSED_WIDTH);
    for(var i = prevIndex ; i <= columnIndex ; i++){
      if(columns[i].collapsed){
        columns[i].collapsed = false;
        columns[i].rows.forEach(function(row, i){
          row.collapsed = false;
        })
        columns[i].w = collapsedWidth;
        transitionInfo.originallyCollapsed.push(i);
      }
    }
    this.setState({columns: columns});
    this.transitionStart('resizing', transitionInfo, function(step){

    });
  },
  rowWillResize(columnIndex, rowIndex){
    var transitionInfo = {
      col: columnIndex,
      row: rowIndex,
      resizingRow: true,
      originallyCollapsed: [],
      savedPercentages: this.rowsArrayPercentages(columnIndex)
    };
    var prevIndex = rowIndex - 1;
    var columns = this.state.columns;
    var rows = columns[columnIndex].rows;

    var collapsedHeight = this.percentageHeightFromPixels(DEFAULT_COLLAPSED_HEIGHT);
    for(var i = prevIndex ; i <= rowIndex ; i++){
      if(rows[i].collapsed){
        rows[i].collapsed = false;
        rows[i].h = collapsedHeight;
        transitionInfo.originallyCollapsed.push(i);
      }
    }
    this.setState({columns: columns});
    this.transitionStart('resizing', transitionInfo, function(step){

    });
  },


  columnResize(diffX){
    var collapsedSize = this.percentageWidthFromPixels(DEFAULT_COLLAPSED_WIDTH);
    var trans = this.state.transition;
    var percentages = this.columnsArrayPercentages();
    var minWidths = this.minWidthsForColumns();
    trans.info.originallyCollapsed.forEach(function(i){
      minWidths[i] = collapsedSize;
    })
    var options = {
      minSizes: minWidths,
      percentageToMove: this.percentageWidthFromPixels(diffX),
      index: trans.info.col,
      collapsed: this.collapsedColumns(),
      orgSizes: trans.info.savedPercentages,
      collapsedSize: collapsedSize
    };

    var newPercentages = this._resizeWithPercentages(percentages, options);
    this.saveColumnPercentagesToState(newPercentages);
  },
  rowResize(diffY){
    var collapsedSize = this.percentageHeightFromPixels(DEFAULT_COLLAPSED_HEIGHT);
    var trans = this.state.transition;
    var colI = trans.info.col;
    var percentages = this.rowsArrayPercentages(colI);
    var minHeights = this.minHeightsForRowsInColumn(colI);
    trans.info.originallyCollapsed.forEach(function(i){
      minHeights[i] = collapsedSize;
    });
    var options = {
      minSizes: minHeights,
      percentageToMove: this.percentageHeightFromPixels(diffY),
      index: trans.info.row,
      collapsed: this.collapsedRowsInColumn(colI),
      orgSizes: trans.info.savedPercentages,
      collapsedSize: collapsedSize
    };
    var newPercentages = this._resizeWithPercentages(percentages, options);
    this.saveRowPercentagesToState(colI, newPercentages);
  },

  rowDidResize(){
    var trans = this.state.transition;
    var colI = trans.info.col;
    var columns = this.state.columns;
    var orgPercentages = trans.info.savedPercentages;
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
    this.transitionNext();
  },

  columnDidResize(){
    var trans = this.state.transition;
    var columns = this.state.columns;
    var orgPercentages = trans.info.savedPercentages;
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
    this.transitionNext();
  },
  // ======================================================
  // Main Resize function to calculate the layout
  // ======================================================
  /*
    minSizes,
    collapsed,
    collapsedSize,
    percentageToMove,
    forceCollapse,
    index
   */
  _moveWithPercentages(percentages, options){
    var retObj = {
    };
    // If target size is too big for the next to. Adjust the moving
    helper.findNeighbor(percentages, {index: options.index}, function(percentage, i){
      if(!options.collapsed[i]){
        if((percentage - options.percentageToMove) < options.minSizes[i]){
          options.percentageToMove = options.minSizes[options.index] - percentages[options.index];
        }
        return true;
      }
    });

    // Set the target size.
    percentages[options.index] += options.percentageToMove;
    var percentageToCounter = -options.percentageToMove;

    helper.findNeighbor(percentages, { index: options.index }, function(percentage, i){
      if( !percentageToCounter || options.collapsed[i] )
        return false;
      var minSize = options.minSizes[i];
      percentage = this.roundedDecimal(percentage + percentageToCounter);
      percentageToCounter = 0;
      if( percentage < minSize ) {
        percentageToCounter = -(minSize - percentage);
        percentage = minSize;
      }
      percentages[i] = percentage;
    }.bind(this));

    var minSizeForIndex = options.minSizes[options.index];
    // If still anything is left to adjust, try see if the index is bigger than its minsize and adjust
    if(percentageToCounter && percentages[options.index] > minSizeForIndex){
      console.log('still stuff left!', percentageToCounter);
      percentages[options.index] += percentageToCounter;
      percentageToCounter= 0;
      if(percentages[options.index] < minSizeForIndex){
        percentageToCounter = -(minSizeForIndex - percentages[options.index]);
        percentages[options.index] = minSizeForIndex;
      }
    }

    // If still anything is left to make space, start minizing right furthest first.
    if(percentageToCounter){
      console.log('left percentage', percentageToCounter);
      helper.findNeighbor(percentages, {index: options.index, furthest: true, rightFirst: true}, function(percentage, i){
        if( !percentageToCounter || options.collapsed[i] )
          return false;

      }.bind(this));
    }
    return percentages;
  },
  /*
    minSizes,
    orgSizes,
    collapsed,
    collapsedSize,
    percentageToMove,
    index
   */
  _resizeWithPercentages(percentages, options){

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

    // Add to all previous up to the min size from the middle and out.
    helper.findNeighbor(percentages, {index: prevIndex, leftOnly: true, furthest: false, includeIndex: true}, function(percentage, i){
      if( !remainingPercentageToAdd || ( i !== options.index && options.collapsed[ realIndex(i) ]) )
        return false;
      var minSize = options.minSizes[ realIndex(i) ];
      if( percentage < minSize ) {
        percentage = this.roundedDecimal(percentage + remainingPercentageToAdd);
        remainingPercentageToAdd = 0;
        if(percentage > minSize){
          remainingPercentageToAdd = percentage - minSize;
          percentage = minSize;
        }
        percentages[i] = percentage;
      }

    }.bind(this));

    // Add to all previous up to the original size they had from the far left towards middle
    helper.findNeighbor(percentages, {index: prevIndex, leftOnly: true, furthest: true, includeIndex: true }, function(percentage, i){
      if( !remainingPercentageToAdd || ( i !== options.index && options.collapsed[ realIndex(i) ]) )
        return false;
      if(options.orgSizes){
        var orgPercentage = options.orgSizes[realIndex(i)];
        if( percentage < orgPercentage ) {
          percentage = this.roundedDecimal(percentage + remainingPercentageToAdd);
          remainingPercentageToAdd = 0;
          if(percentage > orgPercentage){
            remainingPercentageToAdd = percentage - orgPercentage;
            percentage = orgPercentage;
          }
          percentages[i] = percentage;
        }
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
  _sizeTransformations(fromPercentages, toPercentages, isRow){
    var transformations = {};
    var dOldPercentage = 0;
    var dPercentage = 0;
    for(var i = 0 ; i < fromPercentages.length ; i++){
      transformations[i] = {};
      var from = fromPercentages[i];
      var to = toPercentages[i];
      var transform = '';
      var scale = helper.calcScale(from, to);
      if(from !== to){
        var sizePr100 = (scale-1) * from;
        var origin = (dOldPercentage - dPercentage) / sizePr100 * 100;
        if(isRow){
          transform += 'scaleY(' + scale + ') ';
          transformations[i].transformOrigin = '50% ' + origin + '%';
        }
        else{
          transform += 'scaleX(' + scale + ') ';
          transformations[i].transformOrigin = origin + '% 50%';
        }

      }
      else if(dOldPercentage !== dPercentage && Math.abs(dOldPercentage - dPercentage) > 0.1){
        var percentage = (dPercentage - dOldPercentage);
        if(isRow){
          var translateY = this.pixelsHeightFromPercentage(percentage);
          transform += 'translateY(' + translateY + 'px) ';
        }else{
          var translateX = this.pixelsWidthFromPercentage(percentage);
          transform += 'translateX(' + translateX + 'px) ';
        }

      }
      if(transform.length){
        transformations[i].transform = transform;
      }
      dOldPercentage += from;
      dPercentage += to;
    }
    return transformations;
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
  saveColumnPercentagesToState(percentages, validate){
    var columns = this.state.columns;
    percentages.forEach(function(percent, i){
      columns[i].w = percent;
    });
    if(validate){
      columns = this.validateColumns(columns);
    }
    this.setState({columns: columns});

  },
  saveRowPercentagesToState(columnIndex, percentages, validate){
    var columns = this.state.columns;
    var rows = this.state.columns[columnIndex].rows;
    percentages.forEach(function(percent, i){
      rows[i].h = percent;
    })
    if(validate){
      columns = this.validateColumns(columns);
    }
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
  columnsArrayPercentages(replaceCollapsed){
    var arr = [];
    this.state.columns.forEach(function(column){
      if(column.collapsed && replaceCollapsed){
        arr.push(this.percentageWidthFromPixels(DEFAULT_COLLAPSED_WIDTH));
      }
      else {
        arr.push(column.w);
      }
    }.bind(this))
    return arr;
  },
  columnsArrayPixels(replaceCollapsed){
    var arr = [];
    this.state.columns.forEach(function(column){
      if(column.collapsed && replaceCollapsed){
        arr.push(DEFAULT_COLLAPSED_WIDTH);
      }
      else {
        arr.push(this.pixelsWidthFromPercentage(column.w));
      }

    }.bind(this))
    return arr;
  },
  rowsArrayPercentages(columnIndex, replaceCollapsed){
    var arr = [];
    this.state.columns[columnIndex].rows.forEach(function(row){
      if(row.collapsed && replaceCollapsed){
        arr.push(this.percentageHeightFromPixels(DEFAULT_COLLAPSED_HEIGHT));
      }else{
        arr.push(row.h);
      }
    }.bind(this))
    return arr;
  },
  rowsArrayPixels(columnIndex, replaceCollapsed){
    var arr = [];
    this.state.columns[columnIndex].rows.forEach(function(row){
      if(row.collapsed && replaceCollapsed){
        arr.push(DEFAULT_COLLAPSED_HEIGHT);
      }
      else {
        arr.push(this.pixelsHeightFromPercentage(row.h));
      }

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
  transitionNext(transition, stateChanges){
    if(!transition){
      transition = this.state.transition;
    } 
    var timer = 0;
    if(transition){
      var lastIndex = TRANSITIONS_STEPS[transition.name].length - 1;
      var step = null, callback = transition._callback;
      var newTransition = null;
      if(transition._currentIndex < lastIndex){
        transition._currentIndex++;
        var nextStep = TRANSITIONS_STEPS[transition.name][transition._currentIndex];
        if(typeof nextStep === "string"){
          nextStep = {n: nextStep};
        }
        if(nextStep.t){
          timer = nextStep.t;
        }
        transition.step = nextStep.n;
        step = transition.step;
        newTransition = transition;
      }
      var stateChanges;
      if(typeof callback === "function"){
        stateChanges = callback(step);
      }
      var newState = {transition: newTransition};
      if(stateChanges){
        newState = Object.assign(newState, stateChanges);
      }
      this.setState(newState);

      this.callDelegate('gridDidTransitionStep', transition.name, transition.step);
      if(timer){
        setTimeout(function(){
          this.transitionNext();
        }.bind(this), timer);
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
    if(trans.name === "resizing" && !trans.info.resizingRow){
      var minWidths = this.minWidthsForColumns();
      if(column.w < minWidths[colIndex]){
        classes.push("sw-resizing-collapsing-column");
      }
    }
    if(trans.name === 'reordering'){
      if(colIndex === trans.info.col){
        if(trans.info.direction === 'left'){
          styles.boxShadow = SHADOW_LEFT;
        }
        if(trans.info.direction === 'right'){
          styles.boxShadow = SHADOW_RIGHT;
        }
      }
    }
    if(trans.name === 'resizing'){
      if( colIndex === trans.info.col || colIndex === trans.info.col - 1){
        if(column.collapsed){
          styles.width = column.w + '%';
          console.log('forcing width');
        }

      }
    }
    if(trans.name === "collapse"){
      if(trans.info.colTransformations){
        var transformations = trans.info.colTransformations[colIndex];
        if(trans.step === "scaling"){
          styles = transformations;
        }
        if(trans.info.col === colIndex){
          classes.push("sw-collapse-column");
        }
        else if(_.size(transformations)){
          classes.push("sw-collapse-affected-column");
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
    var column = columns[colIndex];
    var row = column.rows[rowIndex];
    var classes = [];
    var styles = {};
    var rippleStyles = {};
    if(trans.name === "resizing" && trans.info.resizingRow){
      if(colIndex === trans.info.col){
        var minHeights = this.minHeightsForRowsInColumn(colIndex);
        if(row.h < minHeights[rowIndex]){
          classes.push("sw-resizing-collapsing-row");
        }
      }

    }
    if(trans.name === 'reordering'){
      if(colIndex === trans.info.col){
        if(rowIndex === trans.info.row){
          if(trans.info.direction === 'top'){
            styles.boxShadow = SHADOW_TOP;
          }
          if(trans.info.direction === 'bottom'){
            styles.boxShadow = SHADOW_BOTTOM;
          }
        }

      }
    }
    if(trans.name === "collapse"){
      if(trans.info.col === colIndex){
        if(trans.info.rowTransformations){
          var transformations = trans.info.rowTransformations[rowIndex];
          if(trans.step === "scaling"){
            styles = transformations;
          }
          if(trans.info.row === rowIndex){
            classes.push('sw-collapse-row');
          }
          if(trans.info.row !== rowIndex && _.size(transformations)){
            classes.push("sw-collapse-affected-row");
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
      if(!step || step === 'isFullscreen'){
        columns[indexes.col].rows[indexes.row].fullscreen = (step === 'isFullscreen');
        this.setState({columns: columns});
      }


    }.bind(this));
  },

  onCollapse(id){
    this._collapseRowWithId(id);
  },
  onExpand(id){
    this._collapseRowWithId(id);
  },
  _collapseRowWithId(id){

    var indexes = this.indexesForRowId(id);
    var columns = this.state.columns;
    var column = columns[indexes.col];
    var row = column.rows[indexes.row];
    var expandingCol = (column.collapsed);
    var expandingRow = (row.collapsed);

    var shouldTransitionRows = false;
    helper.findNeighbor(column.rows, {index: indexes.row, returnIndex: true}, function(r, i){
      if(!r.collapsed){
        shouldTransitionRows = true;
      }
    });

    var transitionInfo = { row: indexes.row, col: indexes.col };

    if(!shouldTransitionRows){
      var collapsedWidth = this.percentageWidthFromPixels(DEFAULT_COLLAPSED_WIDTH);
      var minWidths = this.minWidthsForColumns();
      var oldColPercentages = this.columnsArrayPercentages(true);
      var colPercentages = this.columnsArrayPercentages(true);

      var tempPerc = expandingCol ? column.w - collapsedWidth : (collapsedWidth - column.w);

      var options = {
        minSizes: minWidths,
        percentageToMove: tempPerc,
        index: indexes.col,
        collapsed: this.collapsedColumns(),
        collapsedSize: collapsedWidth
      };

      colPercentages = this._moveWithPercentages(colPercentages, options);

      transitionInfo.colTransformations = this._sizeTransformations(oldColPercentages, colPercentages);
      var targetPercentages = colPercentages.map(function(percentage, i){
        if(percentage < minWidths[i]){
          return columns[i].w;
        }
        return percentage;
      });
      transitionInfo.targetPercentages = targetPercentages;
      console.log('transform', transitionInfo.colTransformations, targetPercentages);
    } else {

      var collapsedHeight = this.percentageHeightFromPixels(DEFAULT_COLLAPSED_HEIGHT);
      var minHeights = this.minHeightsForRowsInColumn(indexes.col);
      var oldRowPercentages = this.rowsArrayPercentages(indexes.col, true);
      var rowPercentages = this.rowsArrayPercentages(indexes.col, true);

      var tempPerc = expandingRow ? row.h - collapsedHeight : (collapsedHeight - row.h);

      var options = {
        minSizes: minHeights,
        percentageToMove: tempPerc,
        index: indexes.row,
        collapsed: this.collapsedRowsInColumn(indexes.col),
        collapsedSize: collapsedHeight
      };

      rowPercentages = this._moveWithPercentages(rowPercentages, options);

      transitionInfo.rowTransformations = this._sizeTransformations(oldRowPercentages, rowPercentages, true);

      var targetPercentages = rowPercentages.map(function(percentage, i){
        if(percentage < minHeights[i]){
          return columns[indexes.col].rows[i].h;
        }
        return percentage;
      });
      transitionInfo.targetPercentages = targetPercentages;
      console.log('transform', transitionInfo.rowTransformations);
    }

    this.transitionStart("collapse", transitionInfo, function(step){
      if(step === "afterScaling"){
        var percentages = transitionInfo.targetPercentages;
        var columns = this.state.columns;
        var rows = columns[indexes.col].rows;
        columns[indexes.col].rows[indexes.row].collapsed = !(expandingRow);
        if(transitionInfo.colTransformations){
          percentages.forEach(function(percent, i){
            columns[i].w = percent;
          });
          columns[indexes.col].rows.forEach(function(row){
            row.collapsed = !(expandingRow);
          })
        }
        else if ( transitionInfo.rowTransformations){
          percentages.forEach(function(percent, i){
            rows[i].h = percent;
          })
        }
        return {columns: this.validateColumns(columns)};
      }
    }.bind(this));
  }
});

module.exports = Grid;
