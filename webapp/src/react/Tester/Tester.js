import React, { useState } from 'react';
import InputToggle from '_shared/Input/Toggle/InputToggle';
import UserImage from '_shared/UserImage/UserImage';

export default function Tester() {
  return (
    <div style={{ width: '100%' }}>
      <InputToggle component={<UserImage size={24} />} />
    </div>
  );
}
