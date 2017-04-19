import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
// import * as a from 'actions';
// import * as ca from 'swipes-core-js/actions';
import { setupDelegate } from 'swipes-core-js/classes/utils';
// import { map, list } from 'react-immutable-proptypes';
// import { fromJS } from 'immutable';
import Icon from 'Icon';
import './styles/milestone-item.scss';

class HOCMilestoneItem extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    setupDelegate(this, props.milestone.get('id'));
    this.callDelegate.bindAll('onOpenMilestone');
  }
  componentDidMount() {
  }
  render() {
    const { milestone } = this.props;
    return (
      <div className="milestone" onClick={this.onOpenMilestone}>
        <div className="milestone__seperator" />
        <div className="header">
          <div className="header__left">
            <div className="header__title">{milestone.get('title')}</div>
          </div>
          <div className="header__icon">
            <Icon icon="ArrowRightLong" className="header__svg" />
          </div>
        </div>
        <div className="milestone__progress">
          <div className="milestone__subtitle">6/9</div>
          <Icon icon="MilestoneProgress" className="milestone__svg milestone__svg--bg" />
          <Icon icon="MilestoneProgress" className="milestone__svg milestone__svg--fg" />

          <div className="progress">
            <div className="progress__dot" />
            <div className="progress__number">25%</div>
          </div>
        </div>
        <div className="last-activity">
          <div className="last-activity__left">
            <img src="https://s3.amazonaws.com/uifaces/faces/twitter/rem/128.jpg" alt="" />
          </div>
          <div className="last-activity__right">
            <div className="last-activity__name">Kasper</div>
            <div className="last-activity__label">completed goal “Notifications”</div>
          </div>
        </div>
      </div>
    );
  }
}
// const { string } = PropTypes;

HOCMilestoneItem.propTypes = {};

function mapStateToProps() {
  return {
  };
}

export default connect(mapStateToProps, {
})(HOCMilestoneItem);
