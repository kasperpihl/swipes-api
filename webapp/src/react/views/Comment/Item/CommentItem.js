import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import { attachmentIconForService } from 'swipes-core-js/classes/utils';
import HOCAssigning from 'components/assigning/HOCAssigning';
import Attachment from 'src/react/components/attachment/Attachment';
import * as linkActions from 'src/redux/link/linkActions';

import chain from 'src/utils/chain';
import parseNewLines from 'src/utils/parseNewLines';
import parseLinks from 'src/utils/parseLinks';
import parseMentions from 'src/utils/parseMentions';
import navWrapper from 'src/react/app/view-controller/NavWrapper';

import CommentReaction from '../Reaction/CommentReaction';
import SW from './CommentItem.swiss';

@navWrapper
@connect(
  null,
  {
    preview: linkActions.preview,
  }
)
export default class CommentItem extends PureComponent {
  onAttachmentClick = att => e => {
    const { preview, target } = this.props;
    preview(target, att);
  };
  renderAttachments() {
    const { comment } = this.props;

    if (!comment.get('attachments') || !comment.get('attachments').size) {
      return undefined;
    }
    return (
      <SW.Attachments>
        {comment.get('attachments').map((att, i) => (
          <Attachment
            title={att.get('title')}
            key={i}
            onClick={this.onAttachmentClick(att)}
            icon={attachmentIconForService(att.getIn(['link', 'service']))}
          />
        ))}
      </SW.Attachments>
    );
  }
  render() {
    const { comment, postId } = this.props;
    const name = msgGen.users.getFullName(comment.get('sent_by'));

    return (
      <SW.Container>
        <SW.Picture>
          <HOCAssigning assignees={[comment.get('sent_by')]} size={36} />
        </SW.Picture>
        <SW.Content>
          <SW.Name>
            {name}
            <SW.Timestamp prefix=" — " simple date={comment.get('sent_at')} />
          </SW.Name>
          <SW.Message>
            {chain(parseNewLines, parseMentions, parseLinks)(
              comment.get('message')
            )}
          </SW.Message>
          {this.renderAttachments()}
        </SW.Content>
        <SW.Actions>
          <CommentReaction
            alignRight
            reactions={comment.get('reactions')}
            postId={postId}
            commentId={comment.get('id')}
          />
        </SW.Actions>
      </SW.Container>
    );
  }
}
