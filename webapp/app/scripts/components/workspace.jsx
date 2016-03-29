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
        //return _.map([], function(card, i) {
            return (
                <CardLoader key={card.id} data={card} dotDragBegin={this.dotDragBegin}/>
            );
        }.bind(this));
    },
    runAdjustments() {
        var width = document.getElementById("actual-app").clientWidth;
        var height = document.getElementById("actual-app").clientHeight;
        this.bouncedAdjusting(width,height);
    },
    dotDragBegin(data, callback){
        console.log('dragging ffs');
        this.isDraggingDot = true;
        $('.active-app').addClass('draggingDot');
        if(callback){
            this.draggingCallback = callback;
        }
    },
    onWindowFocus(e) {
        eventActions.fire('window.focus', e);
    },
    onWindowBlur(e) {
        eventActions.fire('window.blur', e);
    },
    onMouseUp(e) {
        if(this.isDraggingDot){
            $('.active-app').removeClass('draggingDot');
        }
        eventActions.fire('window.onmouseup', e);
    },
    onMouseMove(e) {
        if(this.isDraggingDot){

        }
        eventActions.fire('window.mousemove', e);
    },
    onMouseDown(e) {
        eventActions.fire('window.onmousedown', e);
    },
    componentDidMount(prevProps, prevState) {
        this.bouncedAdjusting = _.debounce(WorkspaceActions.adjustForScreenSize, 300);
        this.runAdjustments();
        window.addEventListener('mouseup', this.onMouseUp);
        window.addEventListener('mousemove', this.onMouseMove);
        window.addEventListener('mousedown', this.onMouseDown);
        window.addEventListener("focus", this.onWindowFocus);
        window.addEventListener("blur", this.onWindowBlur);
        window.addEventListener("resize", this.runAdjustments);
    },
    componentDidUpdate(prevProps, prevState) {
        // K_TODO
        // you are making infinite loop with that one here.
        // It will call WorkspaceActions.adjustForScreenSize
        // which will trigger manualUpdate
        // and this code will be called again and again
        //this.runAdjustments();
    },
    componentWillUnmount() {
        window.removeEventListener('mouseup', this.onMouseUp);
        window.removeEventListener('mousemove', this.onMouseMove);
        window.removeEventListener('mousedown', this.onMouseDown);
        window.removeEventListener("focus", this.onWindowFocus);
        window.removeEventListener("blur", this.onWindowBlur);
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
