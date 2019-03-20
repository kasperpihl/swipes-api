import React, { useState } from 'react';
// import InputField from '_shared/InputField/InputField';

export default function Tester() {
  return (
    <div style={{ width: '100%' }}>
      <InputField
        type="text"
        onChange={handleChangeCallback}
        value={inputVal}
      />
    </div>
  );
}
