import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import SW from './ActionBar.swiss';

export default function ActionBar({ actions, green }) {
  return <SW.Wrapper green={green}>{actions}</SW.Wrapper>;
}

ActionBar.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.object).isRequired
};
