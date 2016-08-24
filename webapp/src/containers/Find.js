import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { main, api } from '../actions';
import { bindAll } from '../classes/utils'

import '../components/find/styles/find.scss'

import Activities from '../components/find/Activities'
import SearchResults from '../components/find/SearchResults'
//ipcListener.sendEvent('showItemInFolder', '/Volumes/Extra\ HD/Dropbox\ \(Swipes\)' + path);
class Find extends Component {
  constructor(props) {
    super(props)
    this.state = {};
    bindAll(this, [ 'dotDragStart'])
  }
  mapResultToCard(doc){
    let title, subtitle, description, onClick;
    if(doc.source === 'slack'){
      
      if(doc.source_content_type === 'file'){
        title = doc.filename;
      }
      else if(doc.source_content_type === 'image/png'){

      }
    }
    else if(doc.source === 'asana'){

    }
    else if(doc.source === 'dropbox'){
      console.log(doc);
      title = doc.filename;
      subtitle = doc.filepath;
    }
    return { title, subtitle, description, onClick }
  }

  componentDidUpdate(){
    const { searchQuery } = this.props;
    if(searchQuery !== this.state.searchQuery){
      this.setState({searchQuery: searchQuery})
      this.props.request('search', {q: searchQuery}).then((res) => {
        const searchResults = res.result.response.docs.map((doc) => this.mapResultToCard(doc));
        this.setState({searchResults: searchResults});
      });
    }
  }
  onClick(e){
    if(e.target.classList.contains("find-overlay")){
      this.props.toggleFind()
    }
  }
  clickedActionFromDot(){

  }
  dotDragStart(shortUrl){
    this.props.toggleFind();
    this.props.startDraggingDot("search", {shortUrl: shortUrl});
    //console.log('dot drag start', params);
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
          <SearchResults title="Results" results={this.state.searchResults}/>
          <Activities title="Recent" subtitle="Mine" activities={recent} dotDragStart={this.dotDragStart}/>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    isFinding: state.main.isFinding,
    searchQuery: state.main.searchQuery,
    draggingDot: state.main.draggingDot,
    recent: state.activity.recent
  }
}

const ConnectedFind = connect(mapStateToProps, {
  toggleFind: main.toggleFind,
  request: api.request,
  startDraggingDot: main.startDraggingDot
})(Find)
export default ConnectedFind
