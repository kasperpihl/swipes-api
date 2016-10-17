import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { fromJS } from 'immutable'
import { main, search } from '../../actions';
import { bindAll } from '../../classes/utils'
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup'

import TabBar from '../../components/tab-bar/TabBar'
import '../../components/find/styles/find.scss'

import Activities from '../../components/find/Activities'
import SearchResults from '../../components/find/SearchResults'
//ipcListener.sendEvent('showItemInFolder', '/Volumes/Extra\ HD/Dropbox\ \(Swipes\)' + path);
class Find extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentTabIndex: 0
    }
    bindAll(this, [ 'dotDragStart', 'onChange', 'onKeyUp', 'onCardClick', 'onCardShare', 'onCardAction'])
    this.unhandledDocs = [];
  }
  
  componentDidMount(){
    setTimeout( () => {
        this.refs.searchInput.focus()
    }, 0)
  }
  onCardClick(card, data){
    //console.log(this.shareDataForChecksum[data.checksum]);
    const folder = localStorage.getItem('dropbox-folder');
    if(folder){
      var path = folder + data.subtitle + '/' + data.title;
      console.log('opening', window.ipcListener.sendEvent('showItemInFolder', path));
    }
  }
  onCardShare(card, data, dragging){
    const { recent, searchResults } = this.props;
    if(data.checksum){ // Is activity
      const activity = recent.find((act) => act.get('checksum') === data.checksum);
      const share = {
        checksum: data.checksum,
        permission: {
          type: 'public',
          account_id: activity.get('account_id')
        },
        meta: activity.get('meta')
      };
      this.props.startDraggingDot("search", share);
    }
    else if(data.xendo_id){
      const obj = searchResults.find((res) => {
        const id = res.getIn(['doc', 'id']);
        return id === data.xendo_id;
      })
      if(obj){
        this.props.startDraggingDot("search", obj.get('shareData').toJS());
      }
      
    }


  }
  onCardAction(card, data, action){
    console.log('action', action);
  }
  dotDragStart(shortUrl){
    //console.log('dot drag start', params);
  }

  renderSearchField() {

    return <input type="text" onKeyUp={this.onKeyUp} ref="searchInput" className="find-overlay__input" placeholder="Search"/>
  }
  onKeyUp(e){
    if(e.keyCode === 13){
      if(this.state.currentTabIndex !== 1){
        this.setState({currentTabIndex: 1});
      }
      this.props.search(this.refs.searchInput.value)
    }
  }
  onChange(i) {
    if(this.state.currentTabIndex !== i){
      this.setState({currentTabIndex: i});
    }
  }
  renderTabs() {
    const tabs = ['Activity', 'Search Results'];
    return (
      <div className="find-overlay__tabs">
        <TabBar data={tabs} onChange={this.onChange} align="left" activeTab={this.state.currentTabIndex}/>
      </div>
    )
  }
  renderContent() {
    const { recent, groupedResults, searching, searchQuery } = this.props;
    if(this.state.currentTabIndex === 0){
      return <Activities title="Recent" subtitle="Mine" key={"activities-" + this.state.currentTabIndex} activities={recent.slice(0,10)} cardDelegate={this}/>;
    }
    else{
      return <SearchResults searching={searching} query={searchQuery} title="Search" key={"search-results-" + this.state.currentTabIndex} results={groupedResults.toJS()} cardDelegate={this} />
    }


  }
  render() {
    let rootClass = 'find-overlay';

    return (
      <div className="find-overlay">
        {this.renderSearchField()}
        {this.renderTabs()}
        <ReactCSSTransitionGroup
          transitionName="fade"
          component="div"
          className="find-overlay__content"
          transitionEnterTimeout={200}
          transitionLeaveTimeout={200}>
          {this.renderContent()}
        </ReactCSSTransitionGroup>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const results = state.getIn(['search', 'searchResults']);
  return {
    searchResults: results,
    groupedResults: results.groupBy((res) => res.getIn(['doc', 'source'])),
    searching: state.getIn(['search', 'searching']),
    searchQuery: state.getIn(['search', 'query']),
    draggingDot: state.getIn(['main', 'draggingDot']),
    recent: state.getIn(['activity', 'recent'])
  }
}

const ConnectedFind = connect(mapStateToProps, {
  search: search.search,
  startDraggingDot: main.startDraggingDot
})(Find)
export default ConnectedFind
