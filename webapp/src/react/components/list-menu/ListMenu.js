import React, { PropTypes } from 'react';
import './styles/list-menu';

const ListMenu = (props) => {
  const {
    items,
  } = props;

  const menuItems = items.map((item, i) => (
    <div className="list-menu__item" onClick={item.onClick} key={`list-item-${i}`}>
      {item.title}
    </div>
  ));

  return (
    <div className="list-menu">
      {menuItems}
    </div>
  );
};

export default ListMenu;

const { array } = PropTypes;

ListMenu.propTypes = {
  items: array,
};
