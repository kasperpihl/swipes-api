import React, { Component, PropTypes } from 'react';
import { setupCachedCallback, setupDelegate } from 'classes/utils';

class Browse extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.onClickCached = setupCachedCallback(this.onClick, this);
    this.onBack = this.onBack.bind(this);
    this.callDelegate = setupDelegate(props.delegate);
  }
  componentDidMount() {
  }
  onClick(i) {
    const { result } = this.props;
    this.callDelegate('clickedEntry', result[i]);
  }
  onBack() {
    this.callDelegate('clickedBack');
  }
  renderBack() {
    const { showBack } = this.props;
    if (!showBack) {
      return undefined;
    }
    return (<div onClick={this.onBack}>Back</div>);
  }
  renderTitle() {
    const { title } = this.props;
    return <h2>{title}</h2>;
  }
  renderResults() {
    const { result } = this.props;
    if (!result) {
      return undefined;
    }
    return result.map((ent, i) => (
      <div onClick={this.onClickCached(i)}>
        {ent.title}
      </div>
    ));
  }
  render() {
    return (
      <div className="browse">
        {this.renderBack()}
        {this.renderTitle()}
        {this.renderResults()}
      </div>
    );
  }
}

export default Browse;

const { string } = PropTypes;

Browse.propTypes = {
  removeThis: string.isRequired,
};
