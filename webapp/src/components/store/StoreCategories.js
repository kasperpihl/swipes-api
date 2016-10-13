import React, { Component, PropTypes } from 'react'
import './styles/store-categories.scss'
import { oneCover, twoCover, threeCover, fourCover, ShapeOne, ShapeTwo, ShapeThree, ShapeFour, ShapeFive, ShapeSix, ShapeSeven, ShapeEight, ShapeNine, ShapeTen  } from '../icons'

class StoreCategories extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount() {
  }
  render() {
    let rootClass = 'store-content';

    return (
      <div className={rootClass}>
        <div className="store-content__title store-content__title--main">Design</div>
        <div className="store-content__category">
          <div className="store-content__item store-content__item--small">
            <div className="store-content__image" style={{backgroundColor: '#edf8f5'}}><ShapeOne /></div>
            <div className="store-content__title store-content__title--item">Develop a concept</div>
            <div className="store-content__author">Uber</div>
            <div className="store-content__description store-content__description--small">When Creating as template, you edit the goal, from the perspective of which things…</div>
          </div>

          <div className="store-content__item store-content__item--small">
            <div className="store-content__image" style={{backgroundColor: '#ffebe0'}}><ShapeTwo /></div>
            <div className="store-content__title store-content__title--item">Develop a concept</div>
            <div className="store-content__author">Uber</div>
            <div className="store-content__description store-content__description--small">When Creating as template, you edit the goal, from the perspective of which things…</div>
          </div>

          <div className="store-content__item store-content__item--small">
            <div className="store-content__image" style={{backgroundColor: '#f4f9fc'}}><ShapeThree /></div>
            <div className="store-content__title store-content__title--item">Develop a concept</div>
            <div className="store-content__author">Uber</div>
            <div className="store-content__description store-content__description--small">When Creating as template, you edit the goal, from the perspective of which things…</div>
          </div>


          <div className="store-content__item store-content__item--small">
            <div className="store-content__image" style={{backgroundColor: '#f0f6f4'}}><ShapeFour /></div>
            <div className="store-content__title store-content__title--item">Develop a concept</div>
            <div className="store-content__author">Uber</div>
            <div className="store-content__description store-content__description--small">When Creating as template, you edit the goal, from the perspective of which things…</div>
          </div>


          <div className="store-content__item store-content__item--small">
            <div className="store-content__image" style={{backgroundColor: '#f7fafe'}}><ShapeFive /></div>
            <div className="store-content__title store-content__title--item">Develop a concept</div>
            <div className="store-content__author">Uber</div>
            <div className="store-content__description store-content__description--small">When Creating as template, you edit the goal, from the perspective of which things…</div>
          </div>
        </div>

        <div className="store-content__title store-content__title--main">Development</div>
        <div className="store-content__category">
          <div className="store-content__item store-content__item--small">
            <div className="store-content__image" style={{backgroundColor: '#effafe'}}><ShapeSix /></div>
            <div className="store-content__title store-content__title--item">Develop a concept</div>
            <div className="store-content__author">Uber</div>
            <div className="store-content__description store-content__description--small">When Creating as template, you edit the goal, from the perspective of which things…</div>
          </div>

          <div className="store-content__item store-content__item--small">
            <div className="store-content__image" style={{backgroundColor: '#f0f6f4'}}><ShapeSeven /></div>
            <div className="store-content__title store-content__title--item">Develop a concept</div>
            <div className="store-content__author">Uber</div>
            <div className="store-content__description store-content__description--small">When Creating as template, you edit the goal, from the perspective of which things…</div>
          </div>

          <div className="store-content__item store-content__item--small">
            <div className="store-content__image" style={{backgroundColor: '#d1e9ea'}}><ShapeEight /></div>
            <div className="store-content__title store-content__title--item">Develop a concept</div>
            <div className="store-content__author">Uber</div>
            <div className="store-content__description store-content__description--small">When Creating as template, you edit the goal, from the perspective of which things…</div>
          </div>


          <div className="store-content__item store-content__item--small">
            <div className="store-content__image" style={{backgroundColor: '#f2f3f4'}}><ShapeNine /></div>
            <div className="store-content__title store-content__title--item">Develop a concept</div>
            <div className="store-content__author">Uber</div>
            <div className="store-content__description store-content__description--small">When Creating as template, you edit the goal, from the perspective of which things…</div>
          </div>


          <div className="store-content__item store-content__item--small">
            <div className="store-content__image" style={{backgroundColor: '#fffaee'}}><ShapeTen /></div>
            <div className="store-content__title store-content__title--item">Develop a concept</div>
            <div className="store-content__author">Uber</div>
            <div className="store-content__description store-content__description--small">When Creating as template, you edit the goal, from the perspective of which things…</div>
          </div>
        </div>

        <div className="store-content__seperator"></div>

        <div className="store-content__title store-content__title--main">Packages</div>

        <div className="store-content__category">
          <div className="store-content__item store-content__item--big">
            <div className="store-content__image">
              <img src={oneCover} />
              <div className="store-content__title store-content__title--big">The Startup Pack</div>
            </div>
            <div className="store-content__description store-content__description--big">When Creating as template, you edit the goal, from the perspective of which things should filled out when someone selects this template. Say… for example you have a decision step for approval and you wont be the decision maker all the time, you can …</div>
          </div>

          <div className="store-content__item store-content__item--big">
            <div className="store-content__image">
              <img src={twoCover} />
              <div className="store-content__title store-content__title--big">Grow fast. Work fast.</div>
            </div>
            <div className="store-content__description store-content__description--big">When Creating as template, you edit the goal, from the perspective of which things should filled out when someone selects this template. Say… for example you have a decision step for approval and you wont be the decision maker all the time, you can …</div>
          </div>

          <div className="store-content__item store-content__item--big">
            <div className="store-content__image">
              <img src={threeCover} />
              <div className="store-content__title store-content__title--big">Product Sprints</div>
            </div>
            <div className="store-content__description store-content__description--big">When Creating as template, you edit the goal, from the perspective of which things should filled out when someone selects this template. Say… for example you have a decision step for approval and you wont be the decision maker all the time, you can …</div>
          </div>

          <div className="store-content__item store-content__item--big">
            <div className="store-content__image">
              <img src={fourCover} />
              <div className="store-content__title store-content__title--big">Conferences</div>
            </div>
            <div className="store-content__description store-content__description--big">When Creating as template, you edit the goal, from the perspective of which things should filled out when someone selects this template. Say… for example you have a decision step for approval and you wont be the decision maker all the time, you can …</div>
          </div>
        </div>
      </div>
    )
  }
}

export default StoreCategories

const { string } = PropTypes;

StoreCategories.propTypes = {
  // removeThis: string.isRequired
}
