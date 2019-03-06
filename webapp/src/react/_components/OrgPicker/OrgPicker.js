import React, { useContext, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import cachedCallback from 'src/utils/cachedCallback';
import SW from './OrgPicker.swiss';
import { MyIdContext } from 'src/react/contexts';

export default connect(state => ({
  organizations: state.organizations
}))(OrgPicker);

function OrgPicker({ organizations, value, onChange, disablePersonal }) {
  const myId = useContext(MyIdContext);
  const foundCheckedRef = useRef(false);
  const handleClickCached = cachedCallback((v, e) => {
    e.stopPropagation();
    onChange(v);
  });

  useEffect(() => {
    if (!foundCheckedRef.current) {
      onChange(organizations.first().get('organization_id'));
    }
  });

  foundCheckedRef.current = false;
  const renderInput = (myValue, title) => {
    const checked = myValue === value;
    if (checked) {
      foundCheckedRef.current = true;
    }
    return (
      <SW.InputWrapper key={myValue} onClick={handleClickCached(myValue)}>
        <input
          type="radio"
          value={myValue}
          checked={myValue === value}
          name="org"
          onChange={handleClickCached(myValue)}
        />
        <SW.Label>{title}</SW.Label>
      </SW.InputWrapper>
    );
  };

  return (
    <SW.Wrapper>
      {!disablePersonal && renderInput(myId, 'Personal')}
      {organizations
        .toList()
        .map(org => renderInput(org.get('organization_id'), org.get('name')))}
    </SW.Wrapper>
  );
}
