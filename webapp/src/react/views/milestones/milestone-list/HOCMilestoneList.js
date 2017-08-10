import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { List } from 'immutable';
// import * as a from 'actions';
import * as ca from 'swipes-core-js/actions';
import * as cs from 'swipes-core-js/selectors';
import { setupLoading } from 'swipes-core-js/classes/utils';
import navWrapper from 'src/react/app/view-controller/NavWrapper';
import MilestoneList from './MilestoneList';

const emptyList = List();

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
  componentWillMount() {
    this.setState({
      tabs: ['Open', 'Closed'],
      tabIndex: 0,
    });
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
  }
  onAddMilestone(title) {
    const { createMilestone } = this.props;
    if (title && title.length && !this.isLoading('add')) {
      this.setLoading('add');
      createMilestone(title).then((res) => {
        if (res && res.ok) {
          this.clearLoading('add');
          window.analytics.sendEvent('Milestone created', {});
        } else {
          this.clearLoading('add', '!Something went wrong');
        }
      });
    }
  }
  tabDidChange(index) {
    const { tabIndex } = this.state;
    if (tabIndex !== index) {
      this.setState({
        tabIndex: index,
      });
    }
  }
  render() {
    const { milestones } = this.props;
    const { tabs, tabIndex } = this.state;

    return (
      <MilestoneList
        delegate={this}
        milestones={milestones.get(tabs[tabIndex])}
        tabs={tabs.map((t) => {
          const size = milestones.get(t).size;
          if (size) {
            t += ` (${size})`;
          }
          return t;
        })}
        tabIndex={tabIndex}
        {...this.bindLoading() }
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    milestones: cs.milestones.getGrouped(state),
  };
}

export default navWrapper(connect(mapStateToProps, {
  createMilestone: ca.milestones.create,
})(HOCMilestoneList));
