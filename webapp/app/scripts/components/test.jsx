var React = require('react');
var Grid = require('./resizeable_grid');
var data = {
  columns: [
    {
      w: 20,
      rows: [
        {
          id: "child1",
          h: 30
        },
        {
          h: 70,
          id: "child2"
        }
      ]
    },
    {
      w: 20,
      rows: [
        {
          h: 100,
          id: "child3"
        }
      ]
    },
    {
      w: 40,
      rows: [
        {
          h: 70,
          id: "child4"
        },
        {
          h: 15,
          id: "child5"
        },
        {
          h: 15,
          id: "child6"
        }
      ]
    },
    {
      w: 20,
      rows: [
        {
          h: 100,
          minimized: true,
          id: "child7"
        }
      ]
    }
  ]
};

var delegate = {
	"willResizeRow": function(grid, size){

	}
}

var Test = React.createClass({
	numberOfRowsInColumns(column){
		return 3;
	},
	gridResizedRow(grid, rowNumber, size){

	},
	updateFromOutside(){
		this.refs.grid.update();
	},
	gridDidUpdate(ref, grid){
		console.log('grid', grid);
	},
	renderGridRowForId(grid, id){
		if(id === "child1"){
      return <div style={{background:"red", width: '100%', height: "100%"}} />;
    }
    if(id === "child2"){
      return <div style={{background:"pink", width: '100%', height: "100%"}} />;
    }
    if(id === "child3"){
      return <div style={{background:"blue", width: '100%', height: "100%"}} />;
    }
    if(id === "child4"){
      return <div style={{background:"salmon", width: '100%', height: "100%"}} />;
    }
    if(id === "child5"){
      return <div style={{background:"orange", width: '100%', height: "100%"}} />;
    }      
    if(id === "child6"){
      return <div style={{background:"yellow", width: '100%', height: "100%"}} />;
    }   
    if(id === "child7"){
      return <div style={{background:"green", width: '100%', height: "100%"}} />;
    }   
    else{
      return <div style={{background:"lightblue", width: '100%', height: "100%"}} />;
    }
	},
	render(){
    return (
      <Grid ref="grid" columns={data.columns} delegate={this} />
    )
  }
});
module.exports = Test;