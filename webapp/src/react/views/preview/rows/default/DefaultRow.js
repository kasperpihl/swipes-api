import React, { PureComponent } from 'react';
import Icon from 'Icon';

import './styles/default-row.scss';

class DefaultRow extends PureComponent {
  renderIcon(icon) {
    if (!icon) {
      return undefined;
    }
    if (icon.src) {
      return (
        <div className="default-row__icon default-row__icon--image">
          <img src={icon.src} alt="presentation" />
        </div>
      );
    } else if (icon.icon) {
      return (
        <div className="default-row__icon default-row__icon--svg">
          <Icon icon={icon.icon} className="default-row__svg" />
        </div>
      );
    } else if (icon.color) {
      const styles = {
        backgroundColor: icon.color,
      };

      return (
        <div className="default-row__icon default-row__icon--circle">
          <div className="default-row__circle" style={styles} />
        </div>
      );
    } else if (icon.initials) {
      return (
        <div className="default-row__icon default-row__icon--initials">{icon.initials}</div>
      );
    }

    return undefined;
  }
  render() {
    const { leftIcon, title, onClick, secondary } = this.props;
    let className = 'default-row';

    if (secondary) {
      className += ' default-row--secondary';
    }

    return (
      <div className={className} onClick={onClick}>
        {this.renderIcon(leftIcon)}
        <div className="default-row__title">
          {title}
        </div>
      </div>
    );
  }
}

export default DefaultRow;
