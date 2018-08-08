import React, {Component} from 'react';
import { SwissProvider } from 'swiss-react';
import SW from './SplitImage.swiss';

class SplitImage extends Component {
  render () {
    const { users, size } = this.props;
    if(!users) return null;
    return (
      <SwissProvider numberOfImages={users.length} size={size}>
        <SW.Container>
          <SW.Left>
            <SW.Image
              user={users[0]}
              leftSide
            />
          </SW.Left>
          {users[1] && (
            <SW.Right>
              <SW.ImageBox>
                <SW.Image
                  user={users[1]}
                  top
                  rightSide
                />
              </SW.ImageBox>
              {users[2] && (
                <SW.ImageBox border>
                  <SW.Image
                    user={users[2]}
                    bottom
                    rightSide
                  />
                </SW.ImageBox>
              )}
            </SW.Right>
          )}
        </SW.Container>
      </SwissProvider>
    )
  }
}

export default SplitImage;
