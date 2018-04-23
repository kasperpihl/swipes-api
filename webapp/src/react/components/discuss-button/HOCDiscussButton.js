import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { styleElement } from 'react-swiss';
import * as cs from 'swipes-core-js/selectors';
import navWrapper from 'src/react/app/view-controller/NavWrapper';
import PostCreate from 'src/react/views/discuss/post-create/HOCPostCreate';
import styles from './DiscussButton.swiss';

const Wrapper = styleElement('div', styles.Wrapper);
const ButtonSide = styleElement('div', styles.ButtonSide);
const Seperator = styleElement('div', styles.Seperator);

class HOCDiscussButton extends PureComponent {
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
