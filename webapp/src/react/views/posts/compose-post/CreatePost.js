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
      <HOCHeaderTitle title="Create Post" subtitle={this.renderSubtitle()}>
        <Button primary text="Post" onClick={this.onSendPost} />
      </HOCHeaderTitle>
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
        'data-id': 'people',
        text: 'Tag Colleagues',
        icon: 'TagColleague',
      },
      {
        'data-id': 'attach',
        text: 'Attach',
        icon: 'Attach',
      }
    ].map(b => (
      <Button
        key={b.text}
        {...b}
        className="create-post__action"
        onClick={this.onButtonClickCached(b['data-id'])}
      />
    ));

    return (
      <div className="create-post__actions">
        {buttons}
      </div>
    )
  }
  render() {
    return (
      <SWView
        header={this.renderHeader()}
        footer={this.renderFooter()}
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
