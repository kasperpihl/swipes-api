import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
// import { map, list } from 'react-immutable-proptypes';
// import { bindAll } from 'swipes-core-js/classes/utils';
// import { setupDelegate } from 'react-delegate';
import SWView from 'SWView';
import HOCHeaderTitle from 'components/header-title/HOCHeaderTitle';
// import Button from 'Button';
// import Icon from 'Icon';
import './styles/swipes-intro.scss';

class SwipesIntro extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    // setupDelegate(this);
    // this.callDelegate.bindAll('onLala');
  }
  renderHeader() {

    return (
      <HOCHeaderTitle
        title="Learn the Workspace"
        subtitle="Understand the basics with this simple guide"
        border={true}
      />
    )
  }
  render() {
    return (
      <SWView header={this.renderHeader()}>
        <div className="swipes-intro">
          <img src="https://s3-us-west-2.amazonaws.com/live.swipesapp.com/uploads/ONY8E94FL/1508152151-URU3EUPOE/swipes-workspace-learn-diagram.png" />
        </div>
      </SWView>
    );
  }
}

export default SwipesIntro

// const { string } = PropTypes;

SwipesIntro.propTypes = {};
