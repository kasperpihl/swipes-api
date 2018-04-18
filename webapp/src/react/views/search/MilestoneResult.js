import React, { PureComponent } from 'react'

import Icon from 'Icon';
import './styles/milestone-result.scss';

export default (props) => {
  return (
    <div className="milestone-result">
      <div className="milestone-result__icon">
        <Icon icon="MiniMilestone" className="milestone-result__svg" />
      </div>
      <div className="milestone-result__title">{result.item.title}</div>
    </div>
  );
};