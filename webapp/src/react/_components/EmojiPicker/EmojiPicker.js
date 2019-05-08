import React from 'react';
import { Picker } from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css';

export default function EmojiPicker({ onSelect, onClick }) {
  return (
    <div>
      <Picker
        style={{
          height: '355px'
        }}
        sheetSize={32}
        autoFocus={true}
        onSelect={onSelect}
        onClick={onClick}
        showPreview={false}
        title=""
        emoji=""
      />
    </div>
  );
}
