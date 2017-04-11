import React, { PureComponent } from 'react';
// import { map, list } from 'react-immutable-proptypes';
import SWView from 'SWView';
import HOCHeaderTitle from 'components/header-title/HOCHeaderTitle';
import HOCAssigning from 'components/assigning/HOCAssigning';
import Button from 'Button';
import './styles/organization.scss';

class Organization extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
  }
  renderUsers() {
    const { users } = this.props;

    const usersHTML = users.map((u) => {
      console.log('user', u.toJS());
      return (
        <div className="organization__user" key={u.get('id')}>
          <div className="organization__user-image">
            <HOCAssigning assignees={[u.get('id')]} rounded size={42} />
          </div>
          <div className="organization__user-name">
            {`${u.get('first_name')} ${u.get('last_name')}`}
            <div className="organization__user-status">Pending</div>
          </div>
          <div className="organization__user-email">
            {u.get('email')}
          </div>
          <div className="organization__user-type">
            ADMIN
          </div>
          <div className="organization__user-actions">
            <Button icon="ThreeDots" />
          </div>
        </div>
      );
    }).toArray();

    return (
      <div className="organization__user-list">
        {usersHTML}
      </div>
    );
  }
  renderInvite() {
    return (
      <div>
        <input type="text" placeholder="First name" />
        <input type="text" placeholder="Email" />
      </div>
    );
  }
  renderHeader() {
    const { organization } = this.props;
    const title = `Manage ${organization.get('name')}`;

    return <HOCHeaderTitle title={title} />;
  }
  render() {
    return (
      <SWView header={this.renderHeader()}>
        <div className="organization">
          {this.renderInvite()}
          {this.renderUsers()}
        </div>
      </SWView>
    );
  }
}

export default Organization;

// const { string } = PropTypes;

Organization.propTypes = {};
