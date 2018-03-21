import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { element } from 'react-swiss';
import * as a from 'actions';
import * as cs from 'swipes-core-js/selectors';
import { bindAll } from 'swipes-core-js/classes/utils';
import navWrapper from 'src/react/app/view-controller/NavWrapper';
import CreatePost from 'src/react/views/posts/compose-post/HOCCreatePost';
import sw from './DiscussButton.swiss';

const Wrapper = element('div', sw.Wrapper);
const ButtonSide = element('div', sw.ButtonSide);
const Seperator = element('div', sw.Seperator);

class HOCDiscussButton extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    bindAll(this, ['onDiscuss', 'onFeed']);
    // setupLoading(this);
  }
  onFeed() {
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
  onDiscuss() {
    const { context, taggedUsers, openModal } = this.props;
    openModal({
      component: CreatePost,
      title: 'Create Post',
      position: 'bottom',
      props: {
        context,
        taggedUsers
      },
    });
  }
  render() {
    const { counter } = this.props;
    return (
      <Wrapper className="discuss-wrapper">
        <ButtonSide left onClick={this.onDiscuss}>Discuss</ButtonSide>
        <Seperator />
        <ButtonSide right onClick={this.onFeed}>{counter}</ButtonSide>
      </Wrapper>
    );
  }
}

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

export default navWrapper(connect(makeMapStateToProps, {
})(HOCDiscussButton));
