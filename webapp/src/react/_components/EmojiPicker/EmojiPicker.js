import React, { PureComponent } from 'react';
import { Picker } from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css';

export default class EmojiPicker extends PureComponent {
  render() {
    const { onSelect } = this.props;
    return (
      <div>
        <Picker
          style={{
            width: '250px',
            height: '355px'
          }}
          sheetSize={32}
          onSelect={onSelect}
          showPreview={false}
          title=""
          emoji=""
        />
      </div>
    );
  }
}
