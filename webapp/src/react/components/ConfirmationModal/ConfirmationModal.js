import React, { useState } from 'react';
import SW from './ConfirmationModal.swiss';

export default function ConfirmationModal({
  callback,
  hideModal,
  text,
  title,
  checkPassword
}) {
  const [password, setPassword] = useState('');

  const handleInputChange = e => {
    setPassword(e.target.value);
  };

  const handleSubmit = e => {
    if (!e.keyCode || e.keyCode === 13) {
      callback(password);
      hideModal();
    }
  };

  return (
    <SW.Wrapper>
      <SW.Title>{title}</SW.Title>
      <SW.Text>{text}</SW.Text>
      {checkPassword && (
        <SW.PasswordInput
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={handleInputChange}
          onKeyUp={handleSubmit}
          autoFocus
        />
      )}
      <SW.ButtonWrapper>
        <SW.Button title="Cancel" onClick={hideModal} />
        <SW.Button title="Confirm" onClick={handleSubmit} />
      </SW.ButtonWrapper>
    </SW.Wrapper>
  );
}
