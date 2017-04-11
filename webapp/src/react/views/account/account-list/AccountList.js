import React, { PureComponent } from 'react'
// import { map, list } from 'react-immutable-proptypes';
import { bindAll, setupDelegate, setupCachedCallback } from 'swipes-core-js/classes/utils';
import Button from 'Button';
// import './styles/account-list.scss';

class AccountList extends PureComponent {
  constructor(props) {
    super(props)

    this.callDelegate = setupDelegate(props.delegate);
    this.onClickCached = setupCachedCallback(this.onClick, this);
  }
  componentDidMount() {
  }
  onClick(i, e) {
    const { sections } = this.props;
    this.callDelegate('onClick', sections[i], e);
  }
  renderSections() {
    const { sections } = this.props;
    return sections.map((s, i) => {
      console.log('sect', s);
      return (
        <Button
          onClick={this.onClickCached(i)}
          text={s.title}
        />
      );
    })
  }
  render() {
    return (
      <div className="account-list">
        {this.renderSections()}
      </div>
    )
  }
}

export default AccountList

// const { string } = PropTypes;

AccountList.propTypes = {};
