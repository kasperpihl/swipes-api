import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { main } from '../actions';
import '../components/find/styles/find.scss'

import Activities from '../components/find/Activities'

class Find extends Component {
  constructor(props) {
    super(props)
    this.startDraggingDot = this.startDraggingDot.bind(this);
  }
  onClick(e){
    if(e.target.classList.contains("find-overlay")){
      this.props.toggleFind()
    }
  }
  startDraggingDot(){
    //this.props.toggleFinding();
    this.props.startDraggingDot("search", {text: "Cool beans"});
  }
  clickedActionFromDot(){
    
  }
  render() {
    const { isFinding, draggingDot } = this.props;
    let className = "find-overlay"
    if(isFinding && !draggingDot){
      className += ' open'
    }
    return (
      <div className={className} onClick={this.onClick.bind(this)}>
        <div className="content-container">
          <Activities title="Recent" subtitle="Mine" activities={[
              { message: "Kasper uploaded a file", date: new Date(), shortUrl: "123slds" },
              { message: "Kristian uploaded a file", date: new Date(new Date().getTime() - 50000), shortUrl: "210313d" }
            ]}
          />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    isFinding: state.main.isFinding,
    draggingDot: state.main.draggingDot
  }
}

const ConnectedFind = connect(mapStateToProps, {
  toggleFind: main.toggleFind,
  startDraggingDot: main.startDraggingDot
})(Find)
export default ConnectedFind