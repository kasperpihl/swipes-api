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
            height: '355px'
          }}
          sheetSize={32}
          autoFocus={true}
          onSelect={onSelect}
          showPreview={false}
          title=""
          emoji=""
        />
      </div>
    );
  }
}
