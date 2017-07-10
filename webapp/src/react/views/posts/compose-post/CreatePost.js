import React, { PureComponent } from 'react'
// import PropTypes from 'prop-types';
// import { map, list } from 'react-immutable-proptypes';
import { bindAll, setupDelegate, setupCachedCallback } from 'swipes-core-js/classes/utils';
import SWView from 'SWView';
import Button from 'Button';
// import Icon from 'Icon';
// import './styles/create-post.scss';

class CreatePost extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {}
    setupDelegate(this);
    this.callDelegate.bindAll('onButtonClick');
  }
  componentDidMount() {
  }
  renderHeader() {

  }
  renderFooter() {

  }
  renderComposer() {
    const { delegate, post, myId } = this.props;

    // return <PostComposer myId={myId} post={post} delegate={delegate} />
  }
  renderActions() {
    const buttons = [
      {
        'data-id': 'type',
        text: 'Change Type',
        icon: '',
      },
      {
        'data-id': 'people',
        text: 'Tag Colleagues',
        icon: '',
      },
      {
        'data-id': 'attach',
        text: 'Attach',
        icon: '',
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
      <div className="create-post">
        <SWView
          header={this.renderHeader()}
          footer={this.renderFooter()}
        >
          {this.renderComposer()}
          {this.renderActions()}
        </SWView>
      </div>
    )
  }
}

export default CreatePost

// const { string } = PropTypes;

CreatePost.propTypes = {};