import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import SW from './ActionBar.swiss';

export default function ActionBar({ actions, green }) {
  return (
    <SW.Wrapper green={green}>
      {actions.map((action, i) => {
          const lastItem = i === (actions.length - 1);
          return (
            <Fragment key={`${action}-${i}`}>
              {action}
              {!lastItem && <SW.Separator />}
            </Fragment>
          )
        })
      }
    </SW.Wrapper>
  );
}

ActionBar.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.object).isRequired
};
