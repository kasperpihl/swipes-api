var React = require('react');
import Loader from '../swipes-ui/Loader'

var ListModal = React.createClass({
	didClickRow: function(row){
		this.props.data.callback(row);
	},
	defaults: {
		title: "Find an item in this list",
		emptyText: "No items left",
		enableSearch: false, // doesn't work
		multiSelect: false, // doesn't work
		rows: [],

	},
	render: function () {

		var options = this.props.data.options;
		if(!options || typeof options !== 'object'){
			options = {};
		}
		options.rows = options.rows || this.defaults.rows;
		var self = this;
		var rows = options.rows.map(function(row){
			// force remove tetris for the time being
			if(!row.id || row.manifest_id === 'tetris') return false;
			return <ListModal.Row key={row.id} onClickRow={self.didClickRow} data={row} />
		});

		var emptyText = options.emptyText || this.defaults.emptyText;
		if(!rows.length){
			rows.push(<div key="list-loader" className="list-modal-loader"> <Loader size={30} text={emptyText} /> </div>);
		}
		var title = options.title || this.defaults.title;

		return (
			<div className="modal-full">
				<h2>{title}</h2>
				<ul className="list-results">
					{rows}
				</ul>
			</div>
		);
	}
});

ListModal.Row = React.createClass({
	onClick:function(){
		this.props.onClickRow(this.props.data);
	},
	render:function(){
		var data = this.props.data;
		// Setting the name/title
		var name = this.props.data.name;

		// Determining image
		var image = "";
		if(data.imageUrl){
			image = <img src={data.imageUrl} />
		}


		return (
			<li className="modal-list" onClick={this.onClick}>
				{image}
				<h3 className="name">{name}</h3>

			</li>
		);
	}
});
module.exports = ListModal;
