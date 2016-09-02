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
      const meta = this.state.cards.meta;
      const actions = meta.actions || [];
      const title = meta.title || "No title!"
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
