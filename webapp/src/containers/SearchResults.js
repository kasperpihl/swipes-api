import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { main } from '../actions';
import '../components/search-results/search-results.scss'

import SwipesCard from '../components/swipes-card/SwipesCard'

class SearchResults extends Component {
  constructor(props) {
    super(props)
    this.startDraggingDot = this.startDraggingDot.bind(this);
  }
  onClick(e){
    if(e.target.classList.contains("search-view-overlay")){
      this.props.toggleSearching()
    }
  }
  renderEmptyScreen(){
    return null; "Type Enter to search"
  }
  startDraggingDot(){
    this.props.toggleSearching();
    this.props.startDraggingDot("search", {text: "Cool beans"});
  }
  clickedActionFromDot(){
    
  }
  render() {
    const { isSearching, draggingDot } = this.props;
    let className = "search-view-overlay"
    if(isSearching && !draggingDot){
      className += ' open'
    }
    return (
      <div className={className} onClick={this.onClick.bind(this)}>
        <div className="search-results">
          <SwipesCard 
            title="Test"
            onDragStart={this.startDraggingDot}
            actions={[{
              label: "Share",
              icon: "share",
              bgColor: "black",
              callback: this.startDraggingDot
            }]} />
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