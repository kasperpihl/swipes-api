'use strict';
var React = require('react');
var Reflux = require('reflux');
var PureRenderMixin = require('react/lib/ReactComponentWithPureRenderMixin');
var ReactGridLayout = require('react-grid-layout');

var WorkspaceStore = require('../stores/WorkspaceStore');
var WorkspaceActions = require('../actions/WorkspaceActions');
var CardLoader = require('./card_loader');
var Card = require('material-ui/lib').Card;

var Workspace = React.createClass({
    mixins: [PureRenderMixin, WorkspaceStore.connect('workflows')],
    getDefaultProps() {
        return {
            className: "layout",
            cols: 12,
            items: 3,
            rowHeight: 50,
            isDraggable: true,
            isResizable: true
            // This turns off compaction so you can place items wherever.
            //verticalCompact: false
        };
    },
    generateDOM() {
        var self = this;
        return _.map(this.state.workflows, function(workflow, i) {
            return (
                <Card key={workflow._grid.i}>
                    <CardLoader data={{id: workflow.workflow_id}} />
                </Card>
            );
        });
    },
    onLayoutChange(layout) {
        WorkspaceActions.saveLayout(layout);
    },

    render() {
        return (
            <div className="grid-scroll-container">
                <ReactGridLayout
                layout={_.pluck(this.state.workflows, '_grid')} 
                onLayoutChange={this.onLayoutChange}
                {...this.props}>
                    {this.generateDOM()}
                </ReactGridLayout>
            </div>
        );
    }
});

module.exports = Workspace;