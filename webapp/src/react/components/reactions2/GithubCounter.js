/* eslint-disable max-len, no-shadow */

import React from 'react';
import reactCSS, { hover } from 'reactcss';
import _ from 'lodash';

import GithubCounterGroup from './GithubCounterGroup';

const GithubCounter = ({ hover, counters, user, onSelect, onAdd }) => {
  const styles = reactCSS({
    default: {
      counter: {
        boxSizing: 'content-box',
        height: '36px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        display: 'flex',
        background: '#fff',
      },
      add: {
        fill: '#4078c0',
        boxSizing: 'content-box',
        width: '25px',
        height: '20px',
        padding: '8px 15px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        cursor: 'pointer',

        opacity: '0',
        transition: 'opacity 0.1s ease-in-out',
      },
    },
    hover: {
      add: {
        opacity: '1',
      },
    },
  }, { hover });

  const groups = _.groupBy(counters, 'emoji');


  return (
    <div style={styles.counter}>
      { _.map(groups, (c, emoji) => {
        const names = _.map(c, 'by');
        return (
          <GithubCounterGroup
            key={emoji}
            emoji={emoji}
            count={c.length}
            names={names}
            active={_.includes(names, user)}
            onSelect={onSelect}
          />
        );
      }) }
      <div style={styles.add} onClick={onAdd}>
        <svg height="16" width="7" viewBox="0 0 7 16" >
          <path d="M4 7V4H3v3H0v1h3v3h1V8h3V7H4z" />
        </svg>
        <svg height="16" width="16" viewBox="0 0 16 16" >
          <path d="M8 0C3.58 0 0 3.58 0 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm4.81 12.81a6.72 6.72 0 0 1-2.17 1.45c-.83.36-1.72.53-2.64.53-.92 0-1.81-.17-2.64-.53-.81-.34-1.55-.83-2.17-1.45a6.773 6.773 0 0 1-1.45-2.17A6.59 6.59 0 0 1 1.21 8c0-.92.17-1.81.53-2.64.34-.81.83-1.55 1.45-2.17.62-.62 1.36-1.11 2.17-1.45A6.59 6.59 0 0 1 8 1.21c.92 0 1.81.17 2.64.53.81.34 1.55.83 2.17 1.45.62.62 1.11 1.36 1.45 2.17.36.83.53 1.72.53 2.64 0 .92-.17 1.81-.53 2.64-.34.81-.83 1.55-1.45 2.17zM4 6.8v-.59c0-.66.53-1.19 1.2-1.19h.59c.66 0 1.19.53 1.19 1.19v.59c0 .67-.53 1.2-1.19 1.2H5.2C4.53 8 4 7.47 4 6.8zm5 0v-.59c0-.66.53-1.19 1.2-1.19h.59c.66 0 1.19.53 1.19 1.19v.59c0 .67-.53 1.2-1.19 1.2h-.59C9.53 8 9 7.47 9 6.8zm4 3.2c-.72 1.88-2.91 3-5 3s-4.28-1.13-5-3c-.14-.39.23-1 .66-1h8.59c.41 0 .89.61.75 1z" />
        </svg>
      </div>
    </div>
  );
};

export default hover(GithubCounter);
