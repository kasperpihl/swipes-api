/*
  props:
  users: [id, id, id]
  No size for now. But think easy to make for later.

  [] Use msgGen.users.getProfileImage etc. See AssigneeImage.js

  Things to test for:
  - Users without an image
  - Working with 1, 2 and 3 images.
  - Positioning of images (look and inspect messengers...)

*/

import React, {Component} from 'react';
import { SwissProvider } from 'swiss-react';
import AssigneeImage from 'src/react/components/assigning/AssigneeImage';
import SW from './SplitImage.swiss';

class SplitImage extends Component {
  render () {
    const { users, size } = this.props;
    console.log(users);
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
