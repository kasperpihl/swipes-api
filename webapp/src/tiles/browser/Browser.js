import React, { Component, PropTypes } from 'react'
class Browser extends Component {
  constructor(props) {
    super(props)
    this.clickedSet = this.clickedSet.bind(this);
    this.state = this.loadDataFromStorage(props.tile.id);
  }
  loadDataFromStorage(tileId){
    const data = {};
    data.url = localStorage.getItem(tileId + '-url');
    return data;
  }
  clickedSet(){
    const url = this.refs['url-input'].value;
    console.log();
    const { id } = this.props.tile;
    localStorage.setItem(id + '-url', url);
    this.setState({url: url});
  }
  componentDidMount() {

  }
  render() {
    if(!this.state.url){
      return (
        <div className="set-url">
          <input type="text" ref="url-input" />
          <button onClick={this.clickedSet}>Set url</button>
        </div>
      );
    }
    return <webview
          src={this.state.url}
          ref='webview'
          className="workflow-frame-class"></webview>
  }
}
export default Browser
