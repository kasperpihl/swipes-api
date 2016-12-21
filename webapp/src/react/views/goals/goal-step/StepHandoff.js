import React, { PropTypes } from 'react';
import Icon from 'Icon';
import './styles/step-handoff';

const StepHandoff = (props) => {
  const {
    svg,
    src,
    name,
    message,
  } = props.data;
  return (
    <div className="step-handoff">
      <Icon svg={svg} src={src} />
      <div className="step-handoff__name">
        {name}
      </div>
      <div className="step-handoff__message">
        {message}
      </div>
    </div>
  );
};

export default StepHandoff;

const { string, shape } = PropTypes;

StepHandoff.propTypes = {
  data: shape({
    message: string,
    name: string,
    svg: string,
    src: string,
  }).isRequired,
};
