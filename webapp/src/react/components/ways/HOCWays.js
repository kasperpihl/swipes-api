import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
// import * as a from 'actions';
// import { map, list } from 'react-immutable-proptypes';
// import { fromJS } from 'immutable';
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
    this.state = {};
  }
  componentDidMount() {
  }
  render() {
    return (
      <div className="sw-ways">
        {templates.map((t, i) => (
          <TemplateItem delegate={this} template={t} key={i} />
        ))}
      </div>
    );
  }
}
// const { string } = PropTypes;

HOCWays.propTypes = {};

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps, {
})(HOCWays);
