import React from 'react';
import { SortableElement, SortableContainer } from 'react-sortable-hoc';

const SortableItem = SortableElement(({ index, delegate, value }) => delegate.renderElement(index, value));

const SortableList = ({ items, delegate, elementProps }) => {

  return (
    <div className="sortable-list" ref="root">
      {items.map((value, index) => (
        <SortableItem key={index} value={value} index={index} delegate={delegate} {...elementProps} />
      ))}
    </div>
  );
};

export default SortableContainer(SortableList, { withRef: true });