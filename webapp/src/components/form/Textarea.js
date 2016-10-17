import React, { Component, PropTypes } from 'react'
import ReactTextarea from 'react-textarea-autosize'

import './styles/textarea.scss'

class Textarea extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount() {
  }
  render() {
    const options = this.props.options || {};
    const styles = this.props.styles || {};
    return (
      <ReactTextarea className="sw-textarea" {...options} style={styles} />
    )
  }
}

export default Textarea

const { string, number, object, shape } = PropTypes;
import { map, mapContains, list, listOf } from 'react-immutable-proptypes'

Textarea.propTypes = {
  options: shape({
    minRows: number,
    maxRows: number,
    placeholder: string,
    defaultValue: string
  }),
  styles: object
}
