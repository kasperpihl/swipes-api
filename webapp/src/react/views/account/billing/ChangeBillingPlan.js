import React, { PureComponent } from 'react';
import { styleElement } from 'swiss-react';
import { setupDelegate } from 'react-delegate';
import Button from 'src/react/components/button/Button';
import styles from './ChangeBillingPlan.swiss';

const Wrapper = styleElement('div', styles.Wrapper);
const ComposerWrapper = styleElement('div', styles.ComposerWrapper);
const ActionBar = styleElement('div', styles.ActionBar);

class ChangeBillingPlan extends PureComponent {
  constructor(props) {
    super(props)
    setupDelegate(this, 'onConfirm');
  }
  render() {
    const { getLoading, content } = this.props;

    return (
      <Wrapper>
        <ComposerWrapper>
          {content}
        </ComposerWrapper>
        <ActionBar>
          <Button
            title="Confirm"
            onClick={this.onConfirm}
            {...getLoading('confirm') } />
        </ActionBar>
      </Wrapper>
    )
  }
}

export default ChangeBillingPlan;