import React, { PureComponent } from 'react'
import { element } from 'react-swiss';
import { setupDelegate } from 'react-delegate';
import { miniIconForId, } from 'swipes-core-js/classes/utils';
import ReactTextarea from 'react-textarea-autosize';
import AutoCompleteInput from 'src/react/components/auto-complete-input/AutoCompleteInput';
import HOCAssigning from 'src/react/components/assigning/HOCAssigning';

import './styles/post-composer.scss';

const ComposerWrapper = element('div', {
  _flex: ['row', 'left', 'top'],
  padding: '18px 24px 18px 30px',
});
const StyledAutoCompleteInput = element(AutoCompleteInput, {
  _font: ['15px', '24px', 300],
  color: '$sw1',
  paddingLeft: '21px',
  paddingTop: '5px',
  resize: 'none',
  width: '100%',
  '&::-webkit-input-placeholder': {
    color: '$sw2',
    fontStyle: 'italic',
  },
  '&:focus': {
    outline: 'none',
  },
});

class PostComposer extends PureComponent {
  constructor(props) {
    super(props)
    setupDelegate(this, 'onMessageChange', 'onFilterClick')
    this.acOptions = {
      types: ['users'],
      delegate: props.delegate,
      trigger: "@",
    }
  }
  renderContextIcon() {
    const { post } = this.props;
    if(!post.getIn(['context', 'id'])) {
      return undefined;
    }
    return (
      <Icon icon={miniIconForId(post.getIn(['context', 'id']))} className="post-composer__svg" />
    )

  }
  renderGeneratedSubtitle() {
    const { post, delegate } = this.props;

    const type = post.get('type');

    let string = ['', {
      id: 'type',
      string: msgGen.posts.getPostComposeTypeTitle(type),
      className: 'post-composer__styled-button post-composer__styled-button--type'
    }];

    const taggedUsers = post.get('taggedUsers');
    if (taggedUsers.size) {
      string.push(' and tag ');
      taggedUsers.forEach((id, i) => {
        if (i > 0) {
          string.push(i === taggedUsers.size - 1 ? ' and ' : ', ');
        }
        string.push({
          id,
          string: msgGen.users.getFirstName(id),
          className: 'post-composer__styled-button post-composer__styled-button--people'
        });
      });
    }

    return (
      <div className="post-composer__subtitle">
        <div className="post-composer__context">
          {this.renderContextIcon()}
          {post.getIn(['context', 'title'])}
        </div>
        <div className="post-composer__styled-text-wrapper">
          <StyledText
            text={string}
            delegate={delegate}
            className="post-composer__styled-text"
          />
        </div>
      </div>
    )
  }
  render() {
    const { myId, post } = this.props;
    const placeholder = `What do you want to discuss, ${msgGen.users.getFirstName(myId)}?`;
    return (
      <ComposerWrapper>
        <HOCAssigning
          assignees={[myId]}
          rounded
          size={30}
        />
        <StyledAutoCompleteInput //ReactTextarea //
          value={post.get('message')}
          minRows={3}
          maxRows={9}
          onChange={this.onMessageChange}
          placeholder={placeholder}
          autoFocus
          options={this.acOptions}
        />
      </ComposerWrapper>
    )
  }
}

export default PostComposer
// const { string } = PropTypes;
PostComposer.propTypes = {};
