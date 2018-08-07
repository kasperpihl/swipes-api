import React, { PureComponent } from 'react';
import { SwissProvider } from 'swiss-react';
import AssigneeImage from 'components/AssigneeImage/AssigneeImage';
import SW from './SplitImage.swiss';

export default class SplitImage extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    const { followers } = this.props;
    const user_ids = followers.map(u => u.user_id);

    return (
      <SwissProvider numberOfImages={followers.length} size={50} >
        <SW.Container>
          <SW.Left>
            <AssigneeImage userId={user_ids[0]} />
          </SW.Left>
          {user_ids[1] && (
            <SW.Right>
              <SW.ImageBox>
                <AssigneeImage userId={user_ids[1]} />
              </SW.ImageBox>
              {user_ids[2] && (
                <SW.ImageBox border>
                  <AssigneeImage userId={user_ids[2]} />
                </SW.ImageBox>
              )}
            </SW.Right>
          )}
        </SW.Container>
      </SwissProvider>
    );
  }
}
