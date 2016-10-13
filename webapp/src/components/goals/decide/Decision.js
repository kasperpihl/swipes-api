import React, { Component, PropTypes } from 'react'
import Button from '../../swipes-ui/Button'

import '../styles/decisions.scss'

class Decision extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount() {
  }
  handleClick() {
    console.log('clicked decision');
  }
  render() {
    return (
      <div className="goal-decisions">
        <div className="goal-decisions__text">Are these designs good enough to move on?</div>
        <div className="goal-decisions__buttons">
          <Button icon="thumb_down" callback={this.handleClick} />
          <Button icon="thumb_up" style={{marginLeft: '15px'}} callback={this.handleClick} />
        </div>
      </div>
    )
  }
}
export default Decision

const { string } = PropTypes;
import { map, mapContains, list, listOf } from 'react-immutable-proptypes'
Decision.propTypes = {

}
