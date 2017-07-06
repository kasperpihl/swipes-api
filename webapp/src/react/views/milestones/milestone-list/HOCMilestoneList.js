import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { List } from 'immutable';
// import * as a from 'actions';
import * as ca from 'swipes-core-js/actions';
import { setupLoading } from 'swipes-core-js/classes/utils';
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
    console.log('open', milestoneId);
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
    const group = milestones.sort(
      (a, b) => {
        if(a.get('closed_at') && b.get('closed_at')){
          return b.get('closed_at').localeCompare(a.get('closed_at'));
        } else if(a.get('closed_at')){
          return 1;
        } else if(b.get('closed_at')) {
          return -1;
        } else {
          return a.get('created_at').localeCompare(b.get('created_at'));
        }
      }
    ).groupBy(m => m.get('closed_at') ? 'Closed' : 'Open');

    return (
      <MilestoneList
        delegate={this}
        milestones={group.get(tabs[tabIndex]) || emptyList}
        tabs={tabs.map((t) => {
          const size = (group.get(t) && group.get(t).size) || 0;
          if (size) {
            t += ` (${size})`;
          }
          return t;
        })}
        tabIndex={tabIndex}
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
  createMilestone: ca.milestones.create,
})(HOCMilestoneList);
