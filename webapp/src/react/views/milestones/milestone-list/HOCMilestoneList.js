import React, { Component, PropTypes } from 'react';
import SWView from 'src/react/app/view-controller/SWView';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import MilestoneItem from './MilestoneItem';
import HOCNavbar from 'components/nav-bar/HOCNavBar';
import { connect } from 'react-redux';
import * as actions from 'actions';

import './styles/milestone-list.scss';


class HOCMilestoneList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
  componentDidMount() {
  }
  renderHeader() {
    const { target } = this.props;

    return (
      <HOCNavbar target={target} />
    );
  }
  renderMilestones() {
    const { users } = this.props;
    const kasper = users.get('UVZWCJDHK');
    const yana = users.get('UB9BXJ1JB');
    const stefan = users.get('URU3EUPOE');

    const milestones = [
      {
        title: 'Design Trips App',
        daysLeft: '30d left',
        goals: {
          total: 4,
          completed: 3,
        },
        status: {
          src: kasper.get('profile_pic'),
          message: 'Kasper completed goal "Notifications"',
          timeAgo: '2d ago',
        },
      },
      {
        title: 'Launch Trips',
        daysLeft: '60d left',
        goals: {
          total: 5,
          completed: 1,
        },
        status: {
          src: yana.get('profile_pic'),
          message: 'Yana completed goal "Launch strategy"',
          timeAgo: 'Just now',
        },
      },
      {
        title: 'Release Trips iOS v1.0',
        daysLeft: '60d left',
        goals: {
          total: 6,
          completed: 1,
        },
        status: {
          src: stefan.get('profile_pic'),
          message: 'Stefan completed steps "Specs"',
          timeAgo: '33d ago',
        },
      },
    ];

    const renderMilestoneItems = milestones.map((m, i) => (
      <MilestoneItem
        key={i}
        title={m.title}
        daysLeft={m.daysLeft}
        goals={m.goals}
        status={m.status}
      />
    ));

    return renderMilestoneItems;
  }
  render() {
    return (
      <SWView header={this.renderHeader()}>
        <div className="milestone-list">
          {this.renderMilestones()}
        </div>
      </SWView>
    );
  }
}

function mapStateToProps(state) {
  return {
    users: state.get('users'),
  };
}

export default connect(mapStateToProps, {
  setStatus: actions.main.setStatus,
})(HOCMilestoneList);
