import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import SW from './ListMenu.swiss';

export default class ListMenu extends PureComponent {
  static propTypes = {
    onClick: PropTypes.func.isRequired,
    buttons: PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.any,
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

    return buttons.map((b, i) => {
      let renderedComp = b;
      if (typeof b === 'string' || (typeof b === 'object' && b.title)) {
        renderedComp = (
          <SW.ItemRow>
            <SW.Title disabled={b.disabled}>{b.title || b}</SW.Title>
            {!!b.disabled ? <SW.Subtitle>{b.subtitle}</SW.Subtitle> : null}
          </SW.ItemRow>
        );
      }
      return (
        <SW.Item
          key={i}
          onClick={() => {
            if (b.disabled) {
              return null;
            } else {
              onClick(i, b);
              hide();
            }
          }}
          disabled={b.disabled}
        >
          {renderedComp}
        </SW.Item>
      );
    });
  };

  render() {
    return <SW.Wrapper>{this.renderButtons()}</SW.Wrapper>;
  }
}
