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
    bindAll(this, [ 'dotDragStart', 'onCardClick', 'onCardShare', 'onCardAction'])
    this.unhandledDocs = [];
  }
  mapResultToCard(doc){
    const shareData = { link: {}, permissions: {}};
    const meta = {};
    let title, subtitle = '', description, onClick;
    const idParts = doc.id.split('-')
    shareData.link.service = doc.source;
    shareData.link.type = doc.content_type;
    shareData.permissions.account_id = shareData.link.service_id;
    if(doc.source === 'slack'){
      shareData.link.id = idParts[idParts.length - 1];

      if(['image', 'file'].indexOf(doc.content_type) > -1){
        meta.title = doc.filename;
        meta.subtitle = 'From ' + doc.author;
      }
      if(doc.content_type === 'message'){
        meta.title = doc.message;
        meta.subtitle = doc.folder.join(', ');
        meta.subtitle += ' - ' + doc.author;
      }
    }
    else if(doc.source === 'asana'){
      if(doc.content_type === 'task'){
        meta.title = doc.title;
        if(doc.folder){
          meta.subtitle = doc.folder.join(', ');
        }
        else{
          meta.subtitle = doc.status;
        }
        if(doc.to){
          meta.subtitle += ': ' + doc.to.join(', ');
        }
      }
    }
    else if(doc.source === 'dropbox'){
      meta.title = doc.filename;
      meta.subtitle = doc.filepath;
    }
    if(!title){
      this.unhandledDocs.push(doc);
    }

    shareData.meta = meta;
    return { meta, shareData };
  }
  search(query){
    this.setState({searchQuery: query, searching: true, searchResults: []})
    this.unhandledDocs = [];
    this.props.request('search', {q: query}).then((res) => {
      const groups = {};
      res.result.response.docs.forEach((doc) => {
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

  onCardClick(card, data){
    console.log('clicked', shareUrlOrData);
  }
  onCardShare(card, data, dragging){
    if(data.checksum){ // Is activity
      this.props.toggleFind();
      this.props.startDraggingDot("search", {checksum: data.checksum});
    }
    
    console.log('sharing', data,  dragging);
  }
  onCardAction(card, data, action){
    console.log('action', action);
  }
  dotDragStart(shortUrl){
    //console.log('dot drag start', params);
  }
  generateActivity(){
    const { recent } = this.props;
    const keys = {}
    return recent.filter((activity) => {
      const id = activity.checksum;
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
          <Activities title="Recent" subtitle="Mine" activities={recent} cardDelegate={this}/>
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
