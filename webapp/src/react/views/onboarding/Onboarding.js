import React, { PureComponent } from 'react'
// import { map, list } from 'react-immutable-proptypes';

class Onboarding extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount() {
  }
  renderItem(item) {
    const { title, subtitle, completed } = item;
  }
  render() {
    const { items } = this.props;
    return (
      <div className="onboarding">
      </div>
    )
  }
}

export default Onboarding

// const { string } = PropTypes;

Onboarding.propTypes = {};
