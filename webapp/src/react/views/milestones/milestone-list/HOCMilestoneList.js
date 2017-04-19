import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as a from 'actions';
import * as ca from 'swipes-core-js/actions';
import { setupLoading } from 'swipes-core-js/classes/utils';
import MilestoneList from './MilestoneList';

class HOCMilestoneList extends PureComponent {
  static minWidth() {
    return 654;
  }
  static maxWidth() {
    return 954;
  }
  constructor(props) {
    super(props);
    setupLoading(this);
  }
  componentDidMount() {
  }
  onOpenMilestone(milestoneId) {
    const { navPush } = this.props;
    navPush({
      id: 'MilestoneOverview',
      title: 'Milestone overview',
      props: {
        milestoneId,
      },
    });
    console.log('open', milestoneId);
  }
  onAddMilestone(e) {
    const { inputMenu, createMilestone } = this.props;
    const options = this.getOptionsForE(e);
    inputMenu({
      ...options,
      placeholder: 'Name of the milestone',
      buttonLabel: 'Create',
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
        milestones={milestones}
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
