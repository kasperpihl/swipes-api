import React, { PropTypes } from 'react';
import './styles/list-menu';

const ListMenu = (props) => {
  const {
    items,
    onClick,
  } = props;

  const menuItems = items.map((item, i) => <div className="list-menu__item" onClick={item.onClick} key={`list-item-${i}`}>{item.title}</div>);

  return (
    <div className="list-menu" onClick={onClick}>
      {menuItems}
    </div>
  );
};

export default ListMenu;

const { array, func } = PropTypes;

ListMenu.propTypes = {
  items: array,
  onClick: func,
};
