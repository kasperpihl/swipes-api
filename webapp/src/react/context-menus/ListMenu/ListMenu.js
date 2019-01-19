import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import SW from './ListMenu.swiss';

export default class ListMenu extends PureComponent {
  static propTypes = {
    onClick: PropTypes.func.isRequired,
    buttons: PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
          icon: PropTypes.string,
          title: PropTypes.string.isRequired,
          disabled: PropTypes.bool,
          subtitle: PropTypes.string
        })
      ]).isRequired
    ).isRequired
  };

  renderButtons = () => {
    const { buttons, onClick, hide } = this.props;

    return buttons.map((b, i) => (
      <SW.ItemRow
        key={i}
        onClick={() => {
          onClick(i, b);
          hide();
        }}
      >
        {b.title || b}
      </SW.ItemRow>
    ));
  };

  render() {
    return <SW.Wrapper>{this.renderButtons()}</SW.Wrapper>;
  }
}
