import React, { PureComponent } from 'react'
// import { map, list } from 'react-immutable-proptypes';
import SWView from 'SWView';
import HOCHeaderTitle from 'components/header-title/HOCHeaderTitle';
import './styles/organization.scss';

class Organization extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount() {
  }
  renderUsers(){
    const { users } = this.props;
    return users.map((u) => {
      return (
        <div key={u.get('id')}>{u.get('first_name')} {u.get('last_name')}</div>
      )
    }).toArray()
  }
  renderInvite() {
    return (
      <div>
        <input type="text" placeholder="First name"/>
        <input type="text" placeholder="Email"/>
      </div>
    )
  }
  renderHeader(){
    const { organization } = this.props;
    const title = `Manage ${organization.get('name')}`;
    return (
      <div className="account-organization__header">
        <HOCHeaderTitle title={title}>
        </HOCHeaderTitle>
      </div>
    );
  }
  render() {
    return (
      <SWView header={this.renderHeader()}>
        <div className="account-organization">
          {this.renderUsers()}
          {this.renderInvite()}
        </div>
      </SWView>
    )
  }
}

export default Organization

// const { string } = PropTypes;

Organization.propTypes = {};
