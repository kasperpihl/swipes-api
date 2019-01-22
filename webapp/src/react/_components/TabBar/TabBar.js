import React from 'react';
import PropTypes from 'prop-types';
import cachedCallback from 'src/utils/cachedCallback';
import SW from './TabBar.swiss';

export default function TabBar(props) {
  const { tabs, value, onChange, ...rest } = props;
  const handleClick = cachedCallback(onChange);
  return (
    <SW.Wrapper {...rest}>
      {tabs.map((tab, i) => (
        <SW.Item active={i === value} key={`tab-${i}`} onClick={handleClick(i)}>
          {tab}
        </SW.Item>
      ))}
    </SW.Wrapper>
  );
}

const { string, arrayOf, number, func } = PropTypes;

TabBar.propTypes = {
  tabs: arrayOf(string).isRequired,
  value: number.isRequired,
  onChange: func.isRequired
};
