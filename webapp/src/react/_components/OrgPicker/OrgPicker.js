import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import cachedCallback from 'src/utils/cachedCallback';
import SW from './OrgPicker.swiss';

@connect(state => ({
  myId: state.me.get('user_id'),
  organizations: state.organizations
}))
export default class OrgPicker extends PureComponent {
  handleClickCached = cachedCallback((value, e) => {
    e.stopPropagation();
    this.props.onChange(value);
  });
  renderInput(myValue, title) {
    const { value } = this.props;
    return (
      <SW.InputWrapper key={myValue} onClick={this.handleClickCached(myValue)}>
        <input
          type="radio"
          value={myValue}
          checked={myValue === value}
          name="org"
          onChange={this.handleClickCached(myValue)}
        />
        <SW.Label>{title}</SW.Label>
      </SW.InputWrapper>
    );
  }
  render() {
    const { organizations, myId } = this.props;

    return (
      <SW.Wrapper>
        {this.renderInput(myId, 'Personal')}
        {organizations
          .toList()
          .map(org =>
            this.renderInput(org.get('organization_id'), org.get('name'))
          )}
      </SW.Wrapper>
    );
  }
}
