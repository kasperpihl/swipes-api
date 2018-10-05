import React, {Component} from 'react';
import { SwissProvider } from 'swiss-react';
import SW from './SplitImage.swiss';
import AssigneeImage from '../assigning/AssigneeImage';

class SplitImage extends Component {
  render () {
    const { users, size } = this.props;

    if(!users) return null;

    return (
      <SwissProvider numberOfImages={users.length} size={size}>
        <SW.Container>
          <SW.Left>
            <AssigneeImage user={users[0]} />
          </SW.Left>
          {users[1] && (
            <SW.Right>
              <AssigneeImage user={users[1]} />
            </SW.Right>
          )}
        </SW.Container>
      </SwissProvider>
    )
  }
}

export default SplitImage;
