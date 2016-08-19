import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { main } from '../actions';
import { bindAll } from '../classes/utils'

import '../components/find/styles/find.scss'

import Activities from '../components/find/Activities'
import SearchResults from '../components/find/SearchResults'

class Find extends Component {
  constructor(props) {
    super(props)
    bindAll(this, ['cardDataDelegate'])
  }
  onClick(e){
    if(e.target.classList.contains("find-overlay")){
      this.props.toggleFind()
    }
  }
  clickedActionFromDot(){

  }
  cardDataDelegate(shortUrl, provider, unsubscribe){
    console.log(shortUrl, unsubscribe);
    if(!unsubscribe){
      shortUrlProvider.subscribe(shortUrl, provider);
    }
    else{
      shortUrlProvider.unsubscribe(shortUrl, provider);
    }

  }
  render() {
    const { isFinding, draggingDot, recent } = this.props;
    let className = "find-overlay"
    if(isFinding && !draggingDot){
      className += ' open'
    }
    return (
      <div className={className} onClick={this.onClick.bind(this)}>
        <div className="content-container">
          <SearchResults title="Results" subtitle="Evernote"/>
          <Activities title="Recent" subtitle="Mine" activities={recent} cardDataDelegate={this.cardDataDelegate}/>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    isFinding: state.main.isFinding,
    draggingDot: state.main.draggingDot,
    recent: state.activity.recent
  }
}

const ConnectedFind = connect(mapStateToProps, {
  toggleFind: main.toggleFind,
  startDraggingDot: main.startDraggingDot
})(Find)
export default ConnectedFind
