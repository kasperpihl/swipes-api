import React, { Component, PropTypes } from 'react'
import './styles/store-header.scss'
import { FindIcon, facebookCover, airbnbCover, uberCover } from '../icons'

class StoreHeader extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount() {
  }
  render() {
    let rootClass = 'store-header';

    return (
      <div className={rootClass}>
        <div className="store-header__section store-header__section--first">
          <div className="store-header__title">Workflows</div>
          <div className="store-header__search">
            <FindIcon className="store-header__icon store-header__icon--find"/>
          </div>
        </div>

        <div className="store-header__section store-header__section--second">
          <div className="store-header__featured">
            <img src={facebookCover} />
            <div className="store-header__featured__title">Run product sprints faster</div>
          </div>
          <div className="store-header__featured">
            <img src={airbnbCover} />
            <div className="store-header__featured__title">Get more done in your meetings</div>
          </div>
          <div className="store-header__featured">
            <img src={uberCover} />
            <div className="store-header__featured__title">Get a project from A to Z</div>
          </div>
        </div>
      </div>
    )
  }
}

export default StoreHeader

const { string } = PropTypes;

StoreHeader.propTypes = {
  // removeThis: string.isRequired
}
