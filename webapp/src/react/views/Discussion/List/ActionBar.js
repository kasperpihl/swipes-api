import React, {Component} from 'react';
import { connect } from 'react-redux';
import * as cs from 'swipes-core-js/selectors';
import DiscussionComposer from '../Composer/DiscussionComposer';
import navWrapper from 'src/react/app/view-controller/NavWrapper';
import SW from './ActionBar.swiss';

@navWrapper
class ActionBar extends Component {
  onDiscuss = () => {
    const { context, taggedUsers, openModal } = this.props;
    openModal({
      component: DiscussionComposer,
      title: 'Create Post',
      position: 'center',
      props: {
        context,
        taggedUsers
      },
    });
  }
  render() {
    return (
      <SW.Wrapper>
        <SW.Button
          onClick={this.onDiscuss}
          icon="Plus"
          sideLabel="Start a new discussion" />
      </SW.Wrapper>
    )
  }
}

export default ActionBar;
