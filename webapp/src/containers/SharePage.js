import React, { Component, PropTypes } from 'react'
import SwipesCard from '../components/swipes-card/SwipesCard'

class SharePage extends Component {
  constructor(props) {
    super(props)
    this.state = {cards: props.data}
  }
  updateAndReloadData(){

  }
  componentDidMount(){
    console.log(this.props.data)
    //this.updateAndReloadData();
  }
  renderCards(){
    if(this.state.cards){
      const meta = this.state.cards.meta;
      return <SwipesCard data={meta} />
    }
    else return "Loading...."
  }
  render() {
    return (
      <div>
        {this.renderCards()}
      </div>
    )
  }
}


module.exports = SharePage;
