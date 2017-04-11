import React, { PureComponent } from 'react'
// import { map, list } from 'react-immutable-proptypes';

// import './styles/account-list.scss';

class AccountList extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount() {
  }
  render() {
    return (
      <div className="account-list" />
    )
  }
}

export default AccountList

// const { string } = PropTypes;

AccountList.propTypes = {};
