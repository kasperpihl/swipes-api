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
    const { userIds, size } = this.props;

    return (
      <SwissProvider numberOfImages={userIds.length} size={size || 50} >
        <SW.Container>
          <SW.Left>
            <AssigneeImage userId={userIds[0]} />
          </SW.Left>
          {userIds[1] && (
            <SW.Right>
              <SW.ImageBox>
                <AssigneeImage userId={userIds[1]} />
              </SW.ImageBox>
              {userIds[2] && (
                <SW.ImageBox border>
                  <AssigneeImage userId={userIds[2]} />
                </SW.ImageBox>
              )}
            </SW.Right>
          )}
        </SW.Container>
      </SwissProvider>
    );
  }
}
