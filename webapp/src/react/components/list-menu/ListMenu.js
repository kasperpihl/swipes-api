import React, { PropTypes } from 'react';
import './styles/list-menu';

const ListMenu = (props) => {
  const {
    title,
    onClick,
  } = props;

  return (
    <div className="list-menu" onClick={onClick}>
      {title}
    </div>
  );
};

export default ListMenu;

const { string, func } = PropTypes;

ListMenu.propTypes = {
  title: string,
  onClick: func,
};
