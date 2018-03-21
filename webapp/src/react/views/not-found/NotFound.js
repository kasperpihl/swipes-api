import React, { PureComponent } from 'react'

class NotFound extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    return (
      <div className="not-found">
        This is not the component you were looking for.
      </div>
    )
  }
}

export default NotFound
