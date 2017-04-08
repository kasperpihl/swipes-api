/* eslint-disable no-shadow */

import React from 'react';
import reactCSS, { hover } from 'reactcss';
import { listOfNames } from './helpers/strings';

const SlackCounterGroup = ({ hover, onSelect, emoji, count, names, active }) => {
  const styles = reactCSS({
    default: {
      group: {
        height: '19px',
        paddingTop: '1px',
        paddingLeft: '3px',
        paddingRight: '4px',
        border: '1px solid #E8E8E8',
        background: '#fff',
        fontSize: '11px',
        color: '#999',
        fontWeight: '500',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
        cursor: 'pointer',
        borderRadius: '5px',
      },
      emoji: {
        fontSize: '16px',
        marginTop: '1px',
        paddingRight: '3px',
      },
      tooltip: {
        maxWidth: '250px',
        wordBreak: 'break-word',
        wordWrap: 'normal',
        whiteSpace: 'nowrap',
        font: `normal normal 11px/1.5 -apple-system, BlinkMacSystemFont, "Segoe UI",
          Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
        color: '#fff',
        background: 'rgba(0,0,0,0.8)',
        borderRadius: '3px',
        padding: '5px 8px',
        position: 'absolute',
        bottom: '100%',
        left: '50%',
        transform: 'translateX(-50%)',
        marginBottom: '4px',

        opacity: '0',
        transition: 'opacity 0.1s ease-in-out',
      },
    },
    hover: {
      tooltip: {
        opacity: '1',
      },
    },
    active: {
      group: {
        background: '#F4FAFF',
        border: '1px solid #BBE1FF',
      },
    },
    'no-names': {
      emoji: {
        paddingRight: '0',
      },
    },
  }, { hover, active: active || hover, 'no-names': !names });

  const handleClick = () => {
    onSelect && onSelect(emoji);
  };

  return (
    <div style={styles.group} onClick={handleClick}>
      <span style={styles.emoji}>{ emoji }</span> { count }
      { names ? (
        <div style={styles.tooltip}>{ listOfNames(names) }</div>
      ) : null }
    </div>
  );
};

export default hover(SlackCounterGroup);
