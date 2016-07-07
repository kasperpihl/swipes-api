import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { main } from '../actions';

class SearchResults extends Component {
	constructor(props) {
    	super(props)
    	this.state = {}
  }
	onClick(e){
		if(e.target.classList.contains("search-view-overlay")){
			this.props.toggleSearching()
		}
	}
	renderEmptyScreen(){
		return "Type Enter to search"
	}
	render() {
		let className = "search-view-overlay"
		if(this.props.isSearching){
			className += ' open'
		}
		return (
			<div className={className} onClick={this.onClick.bind(this)}>
				<div className="search-results">
					{this.renderEmptyScreen()}
				</div>
			</div>
		);
	}
}

function mapStateToProps(state) {
  return {
    isSearching: state.main.isSearching
  }
}

const ConnectedSearchResults = connect(mapStateToProps, {
  toggleSearching: main.toggleSearching
})(SearchResults)
export default ConnectedSearchResults