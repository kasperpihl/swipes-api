import React, { PureComponent } from 'react';
import { styleElement } from 'swiss-react';
import PingComposer from '../Composer/PingComposer';
import PingListItem from './Item/PingListItem';
import styles from './PingList.swiss';
/*
Yana: UB9BXJ1JB
Stefan: URU3EUPOE
Kasper: UVZWCJDHK
Tisho: U3TXFTNCL / USTFL9YVE
Peter: UFXDWRVSU 
*/

const now = new Date();
const subtract = (m) => new Date(now.getTime() + m * 60000).toISOString();
const Wrapper = styleElement('div', styles.Wrapper);
const Title = styleElement('h5', styles.Title);

const items = [
  {
    sent_by: 'URU3EUPOE',
    message: 'Here are the designs',
    sent_at: subtract(-2),
  },
  {
    sent_by: 'USTFL9YVE',
    message: '<3 Check this commit I did earlier: https://github.com/swipesapp/swipes-api/commit/e22786d22d6d2272444d4b6f90d22e37a9d0cae1',
    sent_at: subtract(-10),
  },
  {
    sent_by: 'UFXDWRVSU',
    message: `Today I read these articles:
https://medium.com/@skovy/writing-maintainable-styles-and-components-with-css-modules-308a9216a6c2
https://hackernoon.com/tips-on-react-for-large-scale-projects-3f9ece85983d
And they were really awesome!`,
    sent_at: subtract(-20),
  },
  {
    sent_by: 'UB9BXJ1JB',
    message: 'Check this note I just wrote',
    sent_at: subtract(-45),
  },
  {
    sent_by: 'UVZWCJDHK',
    message: 'Reminder to self: Make pings epic.',
    sent_at: subtract(-150),
  },
];

export default class extends PureComponent {
  renderItems() {
    return items.map((item, i) => (
      <PingListItem item={item} key={i}/>
    ));
  }
  render() {
    return (
      <Wrapper>
        <PingComposer />
        <Title>Pings Received</Title>
        {this.renderItems()}
      </Wrapper>
    );
  }
}
