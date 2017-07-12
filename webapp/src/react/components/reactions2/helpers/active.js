import React from 'react';

const active = Component => class Active extends React.Component {
  constructor(props) {
    super(props);
    this.state = { active: false };
    this.handleMouseDown = () => this.setState({ active: true });
    this.handleMouseUp = () => this.setState({ active: false });
  }

  render() {
    return (
      <div onMouseDown={this.handleMouseDown} onMouseUp={this.handleMouseUp}>
        <Component {...this.props} {...this.state} />
      </div>
    );
  }
  };

export default active;
