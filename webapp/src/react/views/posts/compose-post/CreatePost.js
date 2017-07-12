import React, { PureComponent } from 'react'
// import PropTypes from 'prop-types';
// import { map, list } from 'react-immutable-proptypes';
import { bindAll, setupDelegate, setupCachedCallback, iconForId } from 'swipes-core-js/classes/utils';
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
    this.callDelegate.bindAll('onButtonClick', 'onPostClick', 'onContextClick');
  }
  renderSubtitle() {
    const { post } = this.props;
    if(!post.get('context')) {
      return undefined;
    }

    return (
      <div className="create-post__context" onClick={this.onContextClick}>
        <Icon icon={iconForId(post.getIn(['context', 'id']))} className="create-post__svg" />
        {post.getIn(['context', 'title'])}
      </div>
    )
  }
  renderHeader() {

    return (
      <HOCHeaderTitle title="Create Post" subtitle={this.renderSubtitle()} border />
    )
  }
  renderComposer() {
    const { delegate, post, myId } = this.props;

    return <PostComposer myId={myId} post={post} delegate={delegate} />
  }
  renderActions() {
    const { getLoading } = this.props;

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
        <Button
          primary
          text="Post"
          onClick={this.onPostClick}
          {...getLoading('post')}
          className="create-post__button"
        />
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
