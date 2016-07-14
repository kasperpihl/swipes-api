import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { main } from '../actions';
import SwipesCard from '../components/SwipesCard'

class SearchResults extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  onClick(e){

    if(e.target.classList.contains("search-view-overlay")){
      this.props.toggleSearching()
    }
    else{
      
    }
  }
  onMouseDown(){
    this.props.startDraggingDot("search", {text: "Cool beans"});
  }
  renderEmptyScreen(){
    return "Type Enter to search"
  }
  render() {
    const { isSearching, draggingDot } = this.props;
    let className = "search-view-overlay"
    if(isSearching && !draggingDot){
      className += ' open'
    }
    return (
      <div className={className} onMouseDown={this.onMouseDown.bind(this)} onClick={this.onClick.bind(this)}>
        <div className="search-results">
          <SwipesCard title="Test" />
          {this.renderEmptyScreen()}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    isSearching: state.main.isSearching,
    draggingDot: state.main.draggingDot
  }
}

const ConnectedSearchResults = connect(mapStateToProps, {
  toggleSearching: main.toggleSearching,
  startDraggingDot: main.startDraggingDot
})(SearchResults)
export default ConnectedSearchResults