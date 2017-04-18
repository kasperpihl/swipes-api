import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import SWView from 'src/react/app/view-controller/SWView';
import HOCHeaderTitle from 'components/header-title/HOCHeaderTitle';
import { connect } from 'react-redux';
import * as actions from 'actions';
import Button from 'Button';
import MilestoneItem from './MilestoneItem';
import { Creatable } from 'react-select';
import 'react-select/dist/react-select.css';
import './styles/milestone-list.scss';


class HOCMilestoneList extends PureComponent {
  constructor(props) {
    super(props);
    this.onAddGoals = this.onAddGoals.bind(this);
    const { goals } = props;
    this.state = {
      options: goals.map((g) => ({label: g.get('title'), value: g.get('id')})).toArray(),
      value: undefined
    };
  }
  componentDidMount() {
  }
  onAddGoals(e) {
    console.log('here baby!');

  }
  renderSelect(){
    const { value, options } = this.state;
    return (
      <Creatable
        options={options}
        value={value}
        isLoading={true}
        isOptionUnique={() => true}
        isValidNewOption={() => true}
        promptTextCreator={(string) => {
          if(!string || !string.length) {
            return 'Close this menu';
          } else {
            return `Create new goal "${string}"`;
          }
        }}
      />
    );
  }
  renderHeader() {
    return (
      <div className="milestone-list__header">
        {this.renderSelect()}
      </div>
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
          src: msgGen.users.getPhoto(kasper),
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
          src: msgGen.users.getPhoto(yana),
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
          src: msgGen.users.getPhoto(stefan),
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
    goals: state.get('goals'),
  };
}

export default connect(mapStateToProps, {
  setStatus: actions.main.setStatus,
})(HOCMilestoneList);
