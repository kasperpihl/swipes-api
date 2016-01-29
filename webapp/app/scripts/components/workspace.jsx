'use strict';
var React = require('react');
var Reflux = require('reflux');
var PureRenderMixin = require('react/lib/ReactComponentWithPureRenderMixin');
var ReactGridLayout = require('react-grid-layout');

var WorkflowStore = require('../stores/WorkflowStore');
var CardLoader = require('./card_loader');
var Card = require('material-ui/lib').Card;

var Workspace = React.createClass({
    mixins: [PureRenderMixin],
    getDefaultProps() {
        return {
            className: "layout",
            cols: 12,
            draggableCancel: '.card-top-bar',
            items: 3,
            rowHeight: 50,
            isDraggable: true,
            isResizable: true
            // This turns off compaction so you can place items wherever.
            //verticalCompact: false
        };
    },
    getInitialState(){
        var workspace = {
            id: "workspace_id_1",
            layout: [{
                workflow_id: "W9T38GJ22",
                _grid: {
                    i: 0,
                    x: 0,
                    y: 0,
                    w: 4,
                    h: 8
                }
            },
            {
                workflow_id: "WREUQJXBX",
                _grid: {
                    i: 2,
                    x: 8,
                    y: 0,
                    w: 4,
                    h: 8
                }
            }]
        }
        var layout = _.pluck(workspace.layout, '_grid');
        console.log('lay lay', layout);
        return {
            workspace: workspace,
            layout: layout
        }
    },
    generateDOM() {
        var self = this;
        return _.map(this.state.workspace.layout, function(workflow, i) {
            return (
                <Card key={workflow._grid.i}>
                    <CardLoader data={{id: workflow.workflow_id}} />
                </Card>
            );
        });
    },
    onLayoutChange(layout) {
        for(var i = 0 ; i < layout.length ; i++){
            if(layout[i].moved){
                console.log('moved', layout[i].i, layout[i].x, layout[i].y);
            }
        }
        this.setState({layout:layout});
    },

    render() {
        return (
            <div className="grid-scroll-container">
                <ReactGridLayout
                layout={this.state.layout} 
                onLayoutChange={this.onLayoutChange}
                {...this.props}>
                    {this.generateDOM()}
                </ReactGridLayout>
            </div>
        );
    }
});

module.exports = Workspace;