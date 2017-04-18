import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
<<<<<<< Updated upstream
import * as a from 'actions';
import * as ca from 'swipes-core-js/actions';
import { setupLoading } from 'swipes-core-js/classes/utils';
import { Creatable } from 'react-select';
import 'react-select/dist/react-select.css';
import MilestoneList from './MilestoneList';
=======
import * as actions from 'actions';
import Button from 'Button';
import { Creatable } from 'react-select';
import 'react-select/dist/react-select.css';
import './styles/milestone-list.scss';
import MilestoneItem from './MilestoneItem';

>>>>>>> Stashed changes

class HOCMilestoneList extends PureComponent {
  constructor(props) {
    super(props);
<<<<<<< Updated upstream
    setupLoading(this);
  }
  componentDidMount() {
  }
  onAddMilestone(e) {
    const { inputMenu, createMilestone } = this.props;
    const options = this.getOptionsForE(e);
    inputMenu({
      ...options,
      placeholder: 'Name of the milestone',
      buttonLabel: 'Create Milestone',
    }, (title) => {
      if (title && title.length) {
        this.setLoading('add');
        createMilestone(title).then((res) => {
          if (res && res.ok) {
            this.clearLoading('add', 'Added milestone', 3000);
            window.analytics.sendEvent('Milestone created', {});
          } else {
            this.clearLoading('add', '!Something went wrong');
          }
        });
      }
    });
=======
    this.onAddGoals = this.onAddGoals.bind(this);
    const { goals } = props;
    this.state = {
      options: goals.map(g => ({ label: g.get('title'), value: g.get('id') })).toArray(),
      value: undefined,
    };
  }
  componentDidMount() {
  }
  onAddGoals(e) {
    console.log('here baby!');
  }
  renderSelect() {
    const { value, options } = this.state;
    return (
      <Creatable
        options={options}
        value={value}
        isLoading
        isOptionUnique={() => true}
        isValidNewOption={() => true}
        promptTextCreator={(string) => {
          if (!string || !string.length) {
            return 'Close this menu';
          }
          return `Create new goal "${string}"`;
        }}
      />
    );
>>>>>>> Stashed changes
  }
  getOptionsForE(e) {
    return {
      boundingRect: e.target.getBoundingClientRect(),
      alignX: 'right',
    };
  }

  render() {
    const { milestones } = this.props;
    return (
      <MilestoneList
        delegate={this}
        {...this.bindLoading()}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    milestones: state.get('milestones'),
  };
}

export default connect(mapStateToProps, {
  inputMenu: a.menus.input,
  createMilestone: ca.milestones.create,
})(HOCMilestoneList);
