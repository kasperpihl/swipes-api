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
    this.unhandledDocs = [];
  }
  mapResultToCard(doc){
    let title, subtitle = '', description, onClick;
    if(doc.source === 'slack'){

      if(doc.source_content_type === 'file'){
        title = doc.filename;
      }
      if(doc.source_content_type === 'image/png'){
        title = doc.filename;
        subtitle = 'From ' + doc.author;
      }
      if(doc.source_content_type === 'message'){
        title = doc.message;
        subtitle = doc.folder.join(', ');
        subtitle += ' - ' + doc.author;
      }
    }
    else if(doc.source === 'asana'){
      if(doc.source_content_type === 'task'){
        title = doc.title;
        if(doc.folder){
          subtitle = doc.folder.join(', ');
        }
        else{
          subtitle = doc.status;
        }
        if(doc.to){
          subtitle += ': ' + doc.to.join(', ');
        }
        //subtitle = doc.folder.join(', ');
      }
    }
    else if(doc.source === 'dropbox'){
      title = doc.filename;
      subtitle = doc.filepath;
    }
    if(!title){
      this.unhandledDocs.push(doc);
    }
    subtitle += ' ' + doc.score;
    return { title, subtitle, description, onClick }
  }
  search(query){
    this.setState({searchQuery: query, searching: true, searchResults: []})
    this.unhandledDocs = [];
    this.props.request('search', {q: query}).then((res) => {
      const groups = {};
      res.result.response.docs.forEach((doc) => {
        this.mapResultToCard(doc);
        if(!groups[doc.source]){
          groups[doc.source] = [];
        }
        if(groups[doc.source].length < 3){
          groups[doc.source].push(this.mapResultToCard(doc));
        }
      });
      this.setState({searchResults: groups, searching: false});
      console.log('unhandled', this.unhandledDocs);
      //this.setState({searchResults: searchResults});
    });
  }
  componentDidUpdate(){
    const { searchQuery } = this.props;
    if(searchQuery !== this.state.searchQuery){
      if(!searchQuery || !searchQuery.length){
        this.setState({searchQuery, searchResults: []});
      }
      else{
        this.search(searchQuery);
      }
      console.log('searching', searchQuery);
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
  generateActivity(){
    const { recent } = this.props;
    const keys = {}
    return recent.filter((activity) => {
      const id = activity.short_url;
      if(!keys[id]){
        keys[id] = true;
        return true;
      }
      return false;
    })
  }
  render() {
    const { isFinding, draggingDot } = this.props;
    let className = "find-overlay"
    if(isFinding && !draggingDot){
      className += ' open'
    }
    const recent = this.generateActivity();
    return (
      <div className={className} onClick={this.onClick.bind(this)}>
        <div className="content-container">
          <SearchResults searching={this.state.searching} title="Results" results={this.state.searchResults}/>
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
