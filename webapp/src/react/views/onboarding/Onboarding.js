import React, { PureComponent } from 'react'
// import { map, list } from 'react-immutable-proptypes';

class Onboarding extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount() {
  }
  render() {
    return (
      <div className="onboarding" />
    )
  }
}

export default Onboarding

// const { string } = PropTypes;

Onboarding.propTypes = {};
