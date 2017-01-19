import React, { Component, PropTypes } from 'react';


class ResultItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  renderIcon(obj) {
    if (obj.src) {

    } else if (obj.icon) {

    } else if (obj.button) {

    } else if (obj.label) {

    } else if (obj.initials) {

    }
  }
  renderLeftIcon() {

  }
  renderRightIcon() {

  }
  renderTitle() {

  }
  renderSubtitle() {

  }
  render() {
    return (
      <div className="result-item">
        {this.renderLeftIcon()}
        {this.renderTitle()}
        {this.renderSubtitle()}
        {this.renderRightIcon()}
      </div>
    );
  }
}
const { shape, string, func } = PropTypes;
const iconProps = shape({
  src: string,
  icon: string,
  button: shape({
    icon: string,
    hoverIcon: string,
    color: string,
    hoverColor: string,
  }),
  label: string,
  initials: shape({
    letters: string,
    color: string,
    backgroundColor: string,
  }),
});
ResultItem.propTypes = {
  onClick: func,
  leftIcon: iconProps,
  title: string,
  subtitle: string,
  rightIcon: iconProps,
};

export default ResultItem;
