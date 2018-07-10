import React, { PureComponent } from 'react'
import { miniIconForId } from 'swipes-core-js/classes/utils';
import TextParser from 'components/text-parser/TextParser';
import SW from './PostResult.swiss';

export default class extends PureComponent {

  renderProfileImage() {
    const { result } = this.props;
    const userId = result.item.created_by;
    const image = msgGen.users.getPhoto(userId);
    const initials = msgGen.users.getInitials(userId);

    if (image) {
      return <SW.Image src={image}/>
    }

    return <SW.Initials>{initials}</SW.Initials>
  }
  renderGeneratedTitle() {
    const { result } = this.props;
    const { item } = result;
    const type = item.type;

    let string = [
      {
        id: item.created_by,
        string: msgGen.users.getFirstName(item.created_by, ),
      },
      ' ',
      msgGen.posts.getPostTypeTitle()
    ];

    const taggedUsers = item.tagged_users;

    if (taggedUsers.size) {
      string.push(' and tagged ');

      taggedUsers.forEach((id, i) => {

        if (i > 0) {
          string.push(i === taggedUsers.size - 1 ? ' and ' : ', ');
        }

        string.push({
          id,
          string: msgGen.users.getFirstName(id),
        });
      });
    }

    return (
      <SW.TitleText>
        <SW.StyledText
          text={string}
          delegate={delegate}
        />
      </SW.TitleText>
    )
  }
  renderSubtitle() {
    const { result } = this.props;
    const { item: post } = result;
    const seperator = post.context ? <span>&nbsp;•&nbsp;</span> : undefined;
    const contextTitle = post.context ? post.context.title : null;
    let icon;

    if (post.context) {
      icon = <SW.Icon icon={miniIconForId(post.context.id)} />;
    }

    return (
      <SW.Subtitle>
        {icon}
        <SW.SpanLink>
          {contextTitle}
        </SW.SpanLink>
        {seperator}
        <SW.TimeAgo
          simple
          date={post.created_at}
        />
      </SW.Subtitle>
    );
  }

  renderHeader() {

    return (
      <SW.Header>
        <SW.Titles>
          {this.renderGeneratedTitle()}
          {this.renderSubtitle()}
        </SW.Titles>
      </SW.Header>
    )
  }
  renderMessage() {
    const { result } = this.props;
    const { item } = result;

    return (
      <SW.Message>
        <TextParser>
          {item.message}
        </TextParser>
      </SW.Message>
    )
  }
  render() {
    return (
      <SW.Wrapper>
        <SW.ProfileImage>
          {this.renderProfileImage()}
        </SW.ProfileImage>
        <SW.Right>
          {this.renderHeader()}
          {this.renderMessage()}
        </SW.Right>
      </SW.Wrapper>
    )
  }
}
