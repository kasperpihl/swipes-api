import React, { PureComponent } from 'react';
import DiscussionComposer from '../Composer/DiscussionComposer';
import DiscussionListItem from './Item/DiscussionListItem';
import SW from './DiscussionList.swiss';

const now = new Date();
const subtract = (m) => new Date(now.getTime() + m * 60000).toISOString();
const items = [
  {
    title: 'Design feedback',
    group: ['URU3EUPOE', 'UFXDWRVSU', 'UB9BXJ1JB'],
    last_by: 'URU3EUPOE',
    last_message: 'Here are the designs',
    last_at: subtract(-2),
  },
  {
    title: 'Pushing final stage',
    group: ['USTFL9YVE'],
    unread: true,
    last_by: 'USTFL9YVE',
    last_message: '<3 Check this commit I did earlier: https://github.',
    last_at: subtract(-10),
  },
  {
    title: 'Pushing final stage',
    group: ['UFXDWRVSU'],
    last_by: 'UVZWCJDHK',
    last_message: `Today I read these articles: https://medium.`,
    last_at: subtract(-20),
  },
  {
    title: 'Design feedback',
    group: ['URU3EUPOE', 'UFXDWRVSU'],
    last_by: 'URU3EUPOE',
    last_message: 'Here are the designs',
    last_at: subtract(-2),
  },
  {
    title: 'Pushing final stage',
    group: ['USTFL9YVE'],
    unread: true,
    last_by: 'USTFL9YVE',
    last_message: '<3 Check this commit I did earlier: https://github.',
    last_at: subtract(-10),
  },
  {
    title: 'Pushing final stage',
    group: ['UFXDWRVSU'],
    last_by: 'UVZWCJDHK',
    last_message: `Today I read these articles: https://medium.`,
    last_at: subtract(-20),
  },
];

export default class extends PureComponent {
  renderItems() {
    return items.map((item, i) => (
      <DiscussionListItem item={item} key={i}/>
    ));
  }
  render() {
    return (
      <SW.Wrapper>
        <DiscussionComposer />
        {this.renderItems()}
      </SW.Wrapper>
    );
  }
}
