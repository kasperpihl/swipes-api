import React, { PureComponent } from 'react';
import navWrapper from 'src/react/app/view-controller/NavWrapper';
import SW from './DiscussButton.swiss';
import Button from 'src/react/components/button/Button';

@navWrapper
export default class extends PureComponent {
  onDiscuss = () => {
    const { context, taggedUsers, openModal } = this.props;
    openModal({
      component: 'DiscussionComposer',
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
    return <Button onClick={this.onDiscuss} title="Discuss" />
    return (
      <SW.Wrapper className="discuss-wrapper">
        <SW.ButtonSide left onClick={this.onDiscuss}>Discuss</SW.ButtonSide>
        <SW.Seperator />
        <SW.ButtonSide right>{counter}</SW.ButtonSide>
      </SW.Wrapper>
    );
  }
}
