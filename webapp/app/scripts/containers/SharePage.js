import React, { Component, PropTypes } from 'react'
export default class SharePage extends Component {
  constructor(props) {
    super(props)
  }
  componentDidMount() {
    /*
      Get data from share url
    */
  }
  render() {
    return (
      <div>Share Share
      </div>
    )
  }
}

SharePage.propTypes = {
  data: PropTypes.string.isRequired
}

module.exports = SharePage;