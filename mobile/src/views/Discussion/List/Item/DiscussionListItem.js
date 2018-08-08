import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import * as ca from 'swipes-core-js/actions';
import SplitImage from 'components/SplitImage/SplitImage';
import RippleButton from 'RippleButton';
import SW from './DiscussionListItem.swiss';

@connect(state => ({
  myId: state.me.get('id'),
}), {
  apiRequest: ca.api.request,
})
export default class DiscussionListItem extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    const { followers, topic, timestamp } = this.props;

    return (
      <SW.Wrapper>
        <SW.LeftSide>
          <SplitImage followers={followers} size={40}></SplitImage>
        </SW.LeftSide>
        {/* <SW.RightSide>
          {topic}
        </SW.RightSide> */}
      </SW.Wrapper>
    );
  }
}
