import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import * as cs from 'swipes-core-js/selectors';
import navWrapper from 'src/react/app/view-controller/NavWrapper';
import PostCreate from 'src/react/views/posts/post-create/HOCPostCreate';
import SW from './DiscussButton.swiss';

const makeMapStateToProps = () => {
  const getFilteredList = cs.posts.makeGetFilteredList();
  const getRelatedList = cs.posts.makeGetRelatedList();
  return (state, props) => {
    let counter = getFilteredList(state, props).size;
    if(props.relatedFilter) {
      counter += getRelatedList(state, props).size;
    }
    return { counter };
  }
}

@navWrapper
@connect(makeMapStateToProps)
export default class extends PureComponent {
  onFeed = () => {
    const { openSecondary, context, relatedFilter } = this.props;
    openSecondary({
      id: 'PostFeed',
      title: 'Discussions',
      props: {
        context,
        relatedFilter,
      },
    });
  }
  onDiscuss = () => {
    const { context, taggedUsers, openModal } = this.props;
    openModal({
      component: PostCreate,
      title: 'Create Post',
      position: 'center',
      props: {
        context,
        taggedUsers
      },
    });
  }
  render() {
    const { counter } = this.props;
    return (
      <SW.Wrapper className="discuss-wrapper">
        <SW.ButtonSide left onClick={this.onDiscuss}>Discuss</SW.ButtonSide>
        <SW.Seperator />
        <SW.ButtonSide right onClick={this.onFeed}>{counter}</SW.ButtonSide>
      </SW.Wrapper>
    );
  }
}
