import React, { Component, PropTypes } from 'react'
export default class EmptyBackground extends Component {
  constructor(props) {
    super(props)
    this.state = {openVideo: false}
    this.toggleVideo = this.toggleVideo.bind(this)
  }
  toggleVideo(){
    this.setState({openVideo: !this.state.openVideo})
  }
  renderVideo(){
    if(this.state.openVideo){
      return (
        <div className={"video-box open"} onClick={this.toggleVideo}>
          <iframe src="https://www.youtube.com/embed/vHACsg4QbMg?rel=0&amp&loop=1;showinfo=0" frameBorder="0" allowFullScreen></iframe>
        </div>
      )
    }
    
  }
  render() {
    return (
      <div className="empty-workspace-state">
        <p className="workspace-empty-text">
          <span className="strong">Welcome to your workspace</span> <br />
        </p>
        <img className="empty-workspace-illustration" src="styles/img/emptystate-workspace.svg" onClick={this.toggleVideo} />
        <div className="play-button" onClick={this.toggleVideo}></div>
          <p className="workspace-empty-text">
            Play the video to get started
          </p>
          {this.renderVideo()}
      </div>
    )
  }
}