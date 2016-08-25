import React, { Component, PropTypes } from 'react'
import './test.scss'
const initialState = {

  positions: {
    1: 'alpha',
    2: 'bravo',
    3: 'charlie',
    4: null,
    5: 'delta',
    6: 'echo',
    7: 'foxtrot'
  },
  stateNumber: 0
}
/*
  7 => 4
  6 => 7
  5 => 6
  4 => 5
  3 => 4
  2 => 3
  1 => 2
  4 => 1
 */
class Test extends Component {
  constructor(props) {
    super(props)
    this.state = initialState;
    this.setNextState = this.setNextState.bind(this);
  }
  componentDidMount() {
    this.timer = setInterval(this.setNextState, 200);
  }
  componentWillUnmount(){
    clearInterval(this.timer);
  }
  clipPathForPosition(position){
    position = parseInt(position, 10);

    if(position === 1){
      return 'polygon(35% 0, 65% 0, 65% 30%, 35% 30%)';
    }
    else if(position === 2){
      return 'polygon(0 0, 30% 0, 30% 30%, 0 30%)';
    }
    else if(position === 3){
      return 'polygon(0 35%, 30% 35%, 30% 65%, 0 65%)';
    }
    else if(position === 4){
      return 'polygon(35% 35%, 65% 35%, 65% 65%, 35% 65%)';
    }
    else if(position === 5){
      return 'polygon(35% 70%, 65% 70%, 65% 100%, 35% 100%)';
    }
    else if(position === 6){
      return 'polygon(70% 70%, 100% 70%, 100% 100%, 70% 100%)';
    }
    else if(position === 7){
      return 'polygon(70% 35%, 100% 35%, 100% 65%, 70% 65%)';
    }
  }
  tileIndexToMove(){
    switch(this.state.stateNumber){
      case 0: return 7;
      case 1: return 6;
      case 2: return 5;
      case 3: return 4;
      case 4: return 3;
      case 5: return 2;
      case 6: return 1;
      case 7: return 4;
    }
  }
  positionForTile(radioCommand){
    for(var position in this.state.positions){
      var tile = this.state.positions[position];
      if(tile === radioCommand){
        return position;
      }
    }
  }
  setNextState(){
    const currentPositions = this.state.positions;
    const emptyIndex = this.positionForTile(null);
    const indexToMove = this.tileIndexToMove();
    const newPositions = Object.assign({}, currentPositions, {
      [indexToMove]: null,
      [emptyIndex]: currentPositions[indexToMove]
    });

    const currentState = this.state.stateNumber;
    const nextState = (currentState === 7) ? 0 : currentState + 1;


    this.setState({stateNumber: nextState, positions: newPositions});
  }
  renderTiles(){
    return ['alpha', 'bravo', 'charlie', 'delta', 'echo', 'foxtrot'].map((radioCommand) => {
      const pos = this.positionForTile(radioCommand);
      const styles = {
        WebkitClipPath: this.clipPathForPosition(pos)
      }
      return <div key={"rect-" + radioCommand} style={styles} className={"rect " + radioCommand} />
    })
  }
  render() {
    return (
      <div className="sw-loader__holder">
        {this.renderTiles()}
      </div>
    )
  }
}
export default Test
