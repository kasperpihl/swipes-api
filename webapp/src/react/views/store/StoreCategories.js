import React, { Component } from 'react';
import Icon from '../icons/Icon';

import './styles/store-categories.scss';

class StoreCategories extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const rootClass = 'store-content';

    return (
      <div className={rootClass}>
        <div className="store-content__title store-content__title--main">Design</div>
        <div className="store-content__category">
          <div className="store-content__item store-content__item--small">
            <div className="store-content__image" style={{ backgroundColor: '#edf8f5' }}>
              <Icon svg="ShapeOne" />
            </div>
            <div className="store-content__title store-content__title--item">
              Concept development
            </div>
            <div className="store-content__author">By Uber <br /> Used by 107 companies</div>
            <div className="store-content__description store-content__description--small">
              Good ideas come from creative explorations and research.
              Make it easy for your team to…
            </div>
          </div>

          <div className="store-content__item store-content__item--small">
            <div className="store-content__image" style={{ backgroundColor: '#ffebe0' }}>
              <Icon svg="ShapeTwo" />
            </div>
            <div className="store-content__title store-content__title--item">
              Rebranding strategy
            </div>
            <div className="store-content__author">By Airbnb <br /> Used by 15 companies</div>
            <div className="store-content__description store-content__description--small">
              It’s time for a new fresh company look but it is so hard to get it right.
              Run this process to make…
            </div>
          </div>

          <div className="store-content__item store-content__item--small">
            <div className="store-content__image" style={{ backgroundColor: '#f4f9fc' }}>
              <Icon svg="ShapeThree" />
            </div>
            <div className="store-content__title store-content__title--item">Campaign designs</div>
            <div className="store-content__author">By Nike <br /> Used by 78 companies</div>
            <div className="store-content__description store-content__description--small">
              What’s the right segment? How would the new
              message come across? Test your camp…
            </div>
          </div>


          <div className="store-content__item store-content__item--small">
            <div className="store-content__image" style={{ backgroundColor: '#f0f6f4' }}>
              <Icon svg="ShapeFour" />
            </div>
            <div className="store-content__title store-content__title--item">
              Brainstorming session
            </div>
            <div className="store-content__author">By Buffer <br /> Used by 703 companies</div>
            <div className="store-content__description store-content__description--small">
              Make most out of having the right people in the
              right set-up. How to run 1h brainstorming sess…
            </div>
          </div>


          <div className="store-content__item store-content__item--small">
            <div className="store-content__image" style={{ backgroundColor: '#f7fafe' }}>
              <Icon svg="ShapeFive" />
            </div>
            <div className="store-content__title store-content__title--item">
              Set up design guidelines
            </div>
            <div className="store-content__author">By Facebook <br /> Used by 23 companies</div>
            <div className="store-content__description store-content__description--small">
              Have consistent design across all teams even when
              you scale. Set up a guide that’s easy to…
            </div>
          </div>
        </div>

        <div className="store-content__title store-content__title--main">Development</div>
        <div className="store-content__category">
          <div className="store-content__item store-content__item--small">
            <div className="store-content__image" style={{ backgroundColor: '#effafe' }}>
              <Icon svg="ShapeSix" />
            </div>
            <div className="store-content__title store-content__title--item">2-weeks sprint</div>
            <div className="store-content__author">By Facebook <br /> Used by 1243 companies</div>
            <div className="store-content__description store-content__description--small">
              Set up an objective and choose a coach to direct the sprint.
              Distribute the work realisti...
            </div>
          </div>

          <div className="store-content__item store-content__item--small">
            <div className="store-content__image" style={{ backgroundColor: '#f0f6f4' }}>
              <Icon svg="ShapeSeven" />
            </div>
            <div className="store-content__title store-content__title--item">Kanban workflow</div>
            <div className="store-content__author">By Amazon <br /> Used by 190 companies</div>
            <div className="store-content__description store-content__description--small">
              Manage work between current and new projects.
              Have the full overview of the progr…
            </div>
          </div>

          <div className="store-content__item store-content__item--small">
            <div className="store-content__image" style={{ backgroundColor: '#d1e9ea' }}>
              <Icon svg="ShapeEight" />
            </div>
            <div className="store-content__title store-content__title--item">Bug tracking</div>
            <div className="store-content__author">By Gigster <br /> Used by 31 companies</div>
            <div className="store-content__description store-content__description--small">
              Which bugs have been fixed? What is the progress on a critical item? What…
            </div>
          </div>


          <div className="store-content__item store-content__item--small">
            <div className="store-content__image" style={{ backgroundColor: '#f2f3f4' }}>
              <Icon svg="ShapeNine" />
            </div>
            <div className="store-content__title store-content__title--item">App Store update</div>
            <div className="store-content__author">By Zynga <br /> Used by 359 companies</div>
            <div className="store-content__description store-content__description--small">
              Checklist and process to review the final product version
              before launching the app. Des…
            </div>
          </div>


          <div className="store-content__item store-content__item--small">
            <div className="store-content__image" style={{ backgroundColor: '#fffaee' }}>
              <Icon svg="ShapeTen" />
            </div>
            <div className="store-content__title store-content__title--item">A/B test</div>
            <div className="store-content__author">By Optimizely <br /> Used by 43 companies</div>
            <div className="store-content__description store-content__description--small">
              Run a split test to improve the product engagement or
              website conversions. This proc…
            </div>
          </div>
        </div>

        <div className="store-content__seperator" />

        <div className="store-content__title store-content__title--main">Packages</div>

        <div className="store-content__category">
          <div className="store-content__item store-content__item--big">
            <div className="store-content__image">
              <Icon png="oneCover" />
              <div className="store-content__title store-content__title--big">The Startup Pack</div>
            </div>
            <div className="store-content__description store-content__description--big">
              Full package of workflows for fast growing teams.
              Setting up the right way of doing things from the start will
              help accelerate growth and improve quality. Easy workflows
              to onboard new team mates every week.</div>
          </div>

          <div className="store-content__item store-content__item--big">
            <div className="store-content__image">
              <Icon png="twoCover" />
              <div className="store-content__title store-content__title--big">
                Grow fast. Work fast.
              </div>
            </div>
            <div className="store-content__description store-content__description--big">
              If your team is growing in size but you are still doing most
              of things, you are doing it wrong. Set up easy
              workflows to onboard new team mates every week.
              Keep up with the speed of your growth and scale up faster.
            </div>
          </div>

          <div className="store-content__item store-content__item--big">
            <div className="store-content__image">
              <Icon png="threeCover" />
              <div className="store-content__title store-content__title--big">Product Sprints</div>
            </div>
            <div className="store-content__description store-content__description--big">
              Iterations, QA and product launch workflows to
              help you get the product right. All you need
              package for product teams who are focused on quality and speed.
            </div>
          </div>

          <div className="store-content__item store-content__item--big">
            <div className="store-content__image">
              <Icon png="fourCover" />
              <div className="store-content__title store-content__title--big">Conference Stand</div>
            </div>
            <div className="store-content__description store-content__description--big">
              Plan a conference trip and make most out of the
              networking opportunities. Who should attend the
              conference from your team? What results would you
              achieve with a PR campaign? Who would you meet with?</div>
          </div>
        </div>
      </div>
    );
  }
}

export default StoreCategories;
