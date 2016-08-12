import React, { Component, PropTypes } from 'react'
import SwipesCard from '../components/swipes-card/SwipesCard'

class SharePage extends Component {
  constructor(props) {
    super(props)
    this.state = {data: null}
  }
  updateAndReloadData(){
    swipesApi.request({command: 'share.getData', force: true}, {shareId: this.props.data.short_url}, (res, err) => {
      this.setState({cards: res.data});
    })
  }
  componentDidMount(){
    this.updateAndReloadData();
  }
  renderCards(){
    if(this.state.cards){
      const data = this.state.cards.serviceData;
      const actions = this.state.cards.serviceActions;
      const title = data.title || "No title!"
      return <SwipesCard title={title} actions={actions} />
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