import React, { PureComponent } from 'react';
import { SwissProvider } from 'swiss-react';
import { connect } from 'react-redux';
import { setupLoading } from 'swipes-core-js/classes/utils';
import * as mainActions from 'src/redux/main/mainActions';
import * as menuActions from 'src/redux/menu/menuActions';
import * as ca from 'swipes-core-js/actions';
import SplitImage from 'src/react/components/split-image/SplitImage';
import timeGetDayOrTime from 'swipes-core-js/utils/time/timeGetDayOrTime';
import SW from './DiscussionListItem.swiss';

@connect(
  state => ({
    myId: state.me.get('id'),
  }),
  {
    contextMenu: mainActions.contextMenu,
    confirm: menuActions.confirm,
    request: ca.api.request,
  }
)
export default class DiscussionListItem extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};

    setupLoading(this);
  }
  onClick = () => {
    const { onSelectItemId, item } = this.props;
    onSelectItemId(item.get('id'));
  };
  render() {
    const { item, myId, selected, siblingToSelectedItem } = this.props;
    const subtitle = `${msgGen.users.getName(item.get('last_comment_by'), {
      capitalize: true,
    })}: ${item.get('last_comment')}`;

    let unread = false;
    const subscriber = item
      .get('followers')
      .find(f => f.get('user_id') === myId);

    if (
      subscriber &&
      (!subscriber.get('read_at') ||
        subscriber.get('read_at') < item.get('last_comment_at'))
    ) {
      unread = true;
    }

    return (
      <SwissProvider
        selected={selected}
        unread={unread}
        siblingToSelectedItem={siblingToSelectedItem}
      >
        <SW.Wrapper onClick={this.onClick}>
          <SW.LeftWrapper>
            <SplitImage
              size={44}
              blackAndWhite={!unread}
              users={item
                .get('last_two_comments_by')
                .toJS()}
            />
          </SW.LeftWrapper>
          <SW.MiddleWrapper>
            <SW.Topic>{item.get('topic')}</SW.Topic>
            <SW.Subtitle
              text={subtitle}
              maxLine='2'
              ellipsis='...'
              basedOn='letters'
            />
          </SW.MiddleWrapper>
          <SW.RightWrapper>
            <SW.Time>
              <SW.UnreadCircle />
              {timeGetDayOrTime(item.get('last_comment_at'))}
            </SW.Time>
          </SW.RightWrapper>
        </SW.Wrapper>
      </SwissProvider>
    );
  }
}
