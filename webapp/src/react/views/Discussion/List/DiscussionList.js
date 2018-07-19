import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { setupLoading } from 'swipes-core-js/classes/utils';
import DiscussionListItem from './Item/DiscussionListItem';
import PaginationScrollToMore from 'src/react/components/pagination/PaginationScrollToMore';
import withPagination from 'src/react/components/pagination/withPagination';
import * as mainActions from 'src/redux/main/mainActions';
import * as linkActions from 'src/redux/link/linkActions';
import * as menuActions from 'src/redux/menu/menuActions';
import * as navigationActions from 'src/redux/navigation/navigationActions';
import * as ca from 'swipes-core-js/actions';
import SW from './DiscussionList.swiss';
import ActionBar from './ActionBar';

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

@withPagination
@connect(state => ({
  myId: state.getIn(['me', 'id']),
}), {
  confirm: menuActions.confirm,
  contextMenu: mainActions.contextMenu,
  archiveDiscussion: ca.api.request,
  followDicussion: ca.api.request,
  unfollowDiscussion: ca.api.request,
  archiveDiscussion: ca.api.request,
})
export default class extends PureComponent {
  constructor(props) {
    super(props);

    setupLoading(this)
  }
  renderItems() {
    const { results } = this.props.pagination;
    return (results || []).map((item, i) => (
      <DiscussionListItem item={item} key={i}/>
    ));
  }
  render() {
    return (
      <SW.Wrapper>
        {this.renderItems()}
        <PaginationScrollToMore errorLabel="Couldn't get discussions." />
        <ActionBar />
      </SW.Wrapper>
    );
  }
}
