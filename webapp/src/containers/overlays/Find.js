import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { main, api, workspace } from '../../actions';
import { bindAll } from '../../classes/utils'

import '../../components/find/styles/find.scss'

import Activities from '../../components/find/Activities'
import SearchResults from '../../components/find/SearchResults'
//ipcListener.sendEvent('showItemInFolder', '/Volumes/Extra\ HD/Dropbox\ \(Swipes\)' + path);
class Find extends Component {
  constructor(props) {
    super(props)
    this.state = {};
    bindAll(this, [ 'dotDragStart', 'onCardClick', 'onCardShare', 'onCardAction'])
    this.unhandledDocs = [];
  }
  mapResultToCard(doc){
    const shareData = { link: {}, permission: { type: 'public' }};
    const meta = { };
    const idParts = doc.id.split('-')
    shareData.link.service = doc.source;
    shareData.link.type = doc.content_type;
    shareData.permission.account_id = doc.account_id;
    if(doc.source === 'slack'){
      shareData.link.id = idParts[idParts.length - 1];

      if(['image', 'file', 'document'].indexOf(doc.content_type) > -1){
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
      meta.subtitle = doc.filepath  || '/';
    }
    if(!meta.title){
      this.unhandledDocs.push(doc);
    }

    shareData.meta = JSON.parse(JSON.stringify(meta));
    meta.xendo_id = doc.id;
    this.shareDataForSearchId[meta.xendo_id] = shareData;

    return meta ;
  }
  search(query){
    this.setState({searchQuery: query, searching: true, searchResults: []})
    this.unhandledDocs = [];
    this.shareDataForSearchId = {};
    this.props.request('search', {q: query}).then((res) => {
      const groups = {};

      res.result.forEach((doc) => {
        if(!groups[doc.source]){
          groups[doc.source] = [];
        }
        if(groups[doc.source].length < 3){
          groups[doc.source].push(this.mapResultToCard(doc));
        }
      });

      // To get an array of connected services
      if (this.props.me && this.props.me.services) {
        this.props.me.services.forEach( (connectedService) => {
          if(!groups[connectedService.service_name]){
            groups[connectedService.service_name] = [{
              title: 'No results',
              dot: false
            }]
          }
        })
      }



      this.setState({searchResults: groups, searching: false});
      console.log('unhandled', this.unhandledDocs);
      //this.setState({searchResults: searchResults});
    });
  }
  componentDidMount(){
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
  onCardClick(card, data){
    //console.log(this.shareDataForChecksum[data.checksum]);
    const folder = localStorage.getItem('dropbox-folder');
    if(folder){
      var path = folder + data.subtitle + '/' + data.title;
      console.log('opening', window.ipcListener.sendEvent('showItemInFolder', path));
    }
    console.log('clicked', data);
  }
  onCardShare(card, data, dragging){
    if(data.checksum){ // Is activity
      this.props.startDraggingDot("search", this.shareDataForChecksum[data.checksum]);
    }
    else if(data.xendo_id){
      this.props.startDraggingDot("search", this.shareDataForSearchId[data.xendo_id]);
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
    this.shareDataForChecksum = {}
    return recent.filter((activity) => {
      const id = activity.get('checksum');
      if(!keys[id]){
        this.shareDataForChecksum[id] = {
          checksum: id,
          permission: {
            type: 'public',
            account_id: activity.get('account_id')
          },
          meta: activity.get('meta')
        };
        keys[id] = true;
        return true;
      }
      return false;
    })
  }
  render() {
    const { draggingDot, recent } = this.props;
    let className = "find-overlay"

    return (
      <div className="find-overlay">
        <SearchResults searching={this.state.searching} title="Search" results={this.state.searchResults} cardDelegate={this} />
        <Activities title="Recent" subtitle="Mine" activities={recent.slice(0,10)} cardDelegate={this}/>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    services: state.get('services'),
    me: state.get('me'),
    searchQuery: state.getIn(['main', 'searchQuery']),
    draggingDot: state.getIn(['main', 'draggingDot']),
    recent: state.getIn(['activity', 'recent'])
  }
}

const ConnectedFind = connect(mapStateToProps, {
  request: api.request,
  startDraggingDot: main.startDraggingDot
})(Find)
export default ConnectedFind
