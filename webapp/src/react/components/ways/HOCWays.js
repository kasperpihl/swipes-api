import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
// import * as a from 'actions';
import { goals } from 'swipes-core-js';
// import { map, list } from 'react-immutable-proptypes';
// import { fromJS } from 'immutable';
import { setupLoading } from 'classes/utils';
import Loader from 'components/loaders/Loader';
import TemplateItem from './TemplateItem';
import './styles/ways.scss';

const templates = [
  {
    title: 'Content',
    steps: ['Idea', 'Research topic', 'Write content', 'Feedback', 'Publish'],
    description: 'New blog post in making? Easily collaborate on any content idea and get it out of the door.',
  },
  {
    title: 'Event',
    steps: ['Idea', 'Attendees list', 'Agenda', 'Spread the word', 'Food and drinks'],
    description: 'Muffin Friday in the office? Or planning a teamwork event? 5 steps to get you started and involve the right people.',
  },
  {
    title: 'Design',
    steps: ['Concept & specs', 'Visual research', 'Design mockup', 'Feedback', 'Production ready'],
    description: 'Swiftly execute on a design idea with your team, get feedback and bring it to life.',
  },
  {
    title: 'Research',
    steps: ['Topic of research', 'Existing information', 'Gather data', 'Analytize information', 'Share results', 'Get feedback'],
    description: 'Work together on new opportunities, research ideas and share them with the team.',
  },
  {
    title: 'Development',
    steps: ['Specs', 'Development', 'Testing', 'QA'],
    description: 'Make things happen with your team. Collaborate on product improvements and implement new solutions.',
  },
];

class HOCWays extends PureComponent {
  constructor(props) {
    super(props);
    setupLoading(this);
  }
  componentDidMount() {
  }

  onTemplateClick(tpl) {
    const { loadWay, goalId } = this.props;
    const steps = {};
    const stepOrder = tpl.steps.map((title, i) => {
      const id = `step-${i}`;
      steps[id] = {
        id,
        title,
        assignees: [],
      };
      return id;
    });
    this.setLoading('way');
    loadWay(goalId, { goal: {
      step_order: stepOrder,
      steps,
      attachments: {},
      attachment_order: [],
    } }).then(() => {
      this.clearLoading('way');
    });
  }
  renderLoader() {
    if (!this.getLoading('way').loading) {
      return undefined;
    }
    return <Loader center size={60} />;
  }
  renderTemplates() {
    if (this.getLoading('way').loading) {
      return undefined;
    }
    return templates.map((t, i) => (
      <TemplateItem delegate={this} template={t} key={i} />
    ));
  }
  render() {
    return (
      <div className="sw-ways">
        {this.renderLoader()}
        {this.renderTemplates()}
      </div>
    );
  }
}
const { string, func } = PropTypes;

HOCWays.propTypes = {
  goalId: string,
  loadWay: func,
};

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps, {
  loadWay: goals.loadWay,
})(HOCWays);
