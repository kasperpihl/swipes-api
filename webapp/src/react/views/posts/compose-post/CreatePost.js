import React, { PureComponent } from 'react'
// import PropTypes from 'prop-types';
// import { map, list } from 'react-immutable-proptypes';
import { bindAll, setupDelegate, setupCachedCallback } from 'swipes-core-js/classes/utils';
import SWView from 'SWView';
import Button from 'Button';
import Icon from 'Icon';
import HOCHeaderTitle from 'components/header-title/HOCHeaderTitle';
import PostComposer from './PostComposer';
import './styles/create-post.scss';

class CreatePost extends PureComponent {
  constructor(props) {
    super(props)
    setupDelegate(this);
    this.callDelegate.bindAll('onButtonClick');
  }
  componentDidMount() {
  }
  onSendPost() {

  }
  renderSubtitle() {

    return (
      <div className="create-post__context">
        <Icon icon="MiniGoal" className="create-post__svg" />
        Lorem ipsum.
      </div>
    )
  }
  renderHeader() {

    return (
      <HOCHeaderTitle title="Create Post" subtitle={this.renderSubtitle()} border />
    )
  }
  renderFooter() {

    return (
      <div className="create-post-footer">
        <div className="create-post-footer__action">
          <Button primary text="Post" onClick={this.onSendPost} />
        </div>

      </div>
    )
  }
  renderComposer() {
    const { delegate, post, myId } = this.props;

    return <PostComposer myId={myId} post={post} delegate={delegate} />
  }
  renderActions() {
    const buttons = [
      {
        'data-id': 'type',
        text: 'Change Type',
        icon: 'Decision',
      },
      {
        'data-id': 'users',
        text: 'Tag Colleagues',
        icon: 'TagColleague',
      },
      {
        'data-id': 'attach',
        text: 'Attach',
        icon: 'Attach',
      }
    ].map(b => (
      <button key={b.text} className="create-post__action" onClick={this.onButtonClickCached(b['data-id'])}>
        <Icon icon={b.icon} className="create-post__action-icon" />
        <div className="create-post__action-label">
          {b.text}
        </div>
      </button>
    ));

    return (
      <div className="create-post__actions">
        {buttons}
        <Button primary text="Post" onClick={this.onSendPost} className="create-post__button" />
      </div>
    )
  }
  render() {
    return (
      <SWView
        header={this.renderHeader()}
      >
        {this.renderComposer()}
        {this.renderActions()}
      </SWView>
    )
  }
}

export default CreatePost

// const { string } = PropTypes;

CreatePost.propTypes = {};
