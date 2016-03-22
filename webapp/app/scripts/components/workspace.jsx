'use strict';
var React = require('react');
var Reflux = require('reflux');

var DragDropContext = require('react-dnd').DragDropContext;
var HTML5Backend = require('react-dnd-html5-backend');

var WorkspaceStore = require('../stores/WorkspaceStore');
var WorkspaceActions = require('../actions/WorkspaceActions');
var eventActions = require('../actions/EventActions');

var CardLoader = require('./card_loader');
var Card = require('material-ui/lib/card/card');

var Workspace = React.createClass({
    mixins: [WorkspaceStore.connect('workspace')],
    renderCards(){
        return _.map(this.state.workspace, function(card, i) {
            return (
                <CardLoader key={card.id} data={card} />
            );
        });
    },
    runAdjustments() {
        var width = document.getElementById("actual-app").clientWidth;
        var height = document.getElementById("actual-app").clientHeight;
        this.bouncedAdjusting(width,height);
    },
    onWindowFocus() {
        eventActions.fire('window.focus');
    },
    componentDidMount(prevProps, prevState) {
        this.bouncedAdjusting = _.debounce(WorkspaceActions.adjustForScreenSize, 300);
        this.runAdjustments();
        window.addEventListener("focus", this.onWindowFocus);
        window.addEventListener("resize", this.runAdjustments);
    },
    componentDidUpdate(prevProps, prevState) {
        this.runAdjustments();
    },
    componentWillUnmount() {
        window.removeEventListener("focus", this.onWindowFocus);
        window.removeEventListener("resize", this.runAdjustments);
    },
    render() {
        return (
            <div id="actual-app" className="actual-app">
                {this.renderCards()}
            </div>
        );
    }
});

module.exports = DragDropContext(HTML5Backend)(Workspace);