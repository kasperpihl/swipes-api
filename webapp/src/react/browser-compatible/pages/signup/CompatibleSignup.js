import React, { PureComponent } from 'react';
import { setupDelegate } from 'react-delegate';
import { styleElement } from 'swiss-react';
import Icon from 'Icon';
import FloatingInput from 'compatible/components/input/FloatingInput';
import CompatibleHeader from 'compatible/components/header/CompatibleHeader';
import CompatibleButton from 'compatible/components/button/CompatibleButton';
import { Link } from 'react-router-dom';
import styles from './styles/CompatibleSignup.swiss'

const Wrapper = styleElement('div', styles.Wrapper);
const Form = styleElement('form', styles.Form);
const Illustration = styleElement(Icon, styles.Illustration);
const Footer = styleElement('div', styles.Footer);
const ErrorLabel = styleElement('div', styles.ErrorLabel);
const Switch = styleElement('div', styles.Switch);
const LinkButton = styleElement(Link, styles.LinkButton);
const FooterSentence = styleElement('div', styles.FooterSentence);

class CompatibleSignup extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    setupDelegate(this, 'onChange', 'onSignup', 'onNavigateToLogin');
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }
  handleKeyDown(e) {
    if (e.keyCode === 13) {
      this.onSignup();
    }
  }
  getSubtitle() {
    const { organization } = this.props;

    if (!organization) {
      return 'In the Workspace, you unite the work of your team. Start your 14-day free trial by signing up. No credit card required. ';
    }

    return 'Your team is waiting for you. Sign up to join them.';
  }
  generateTitle() {
    const { organization, inviter } = this.props;

    if (!organization) {
      return 'Get Started';
    }

    return `Join ${msgGen.users.getFirstName(inviter)} and the ${organization.get('name')} team`;
  }
  renderHeader() {
    const { inviter } = this.props;

    return ([
      <CompatibleHeader center title={this.generateTitle()} assignee={inviter} key="title" />,
      <Illustration icon="ESMilestoneAchieved"  key="illustration" />,
      <CompatibleHeader subtitle={this.getSubtitle()} key="subtitle" />
    ])
  }
  renderInputField(key, type, placeholder, props) {
    const { delegate } = this.props;
    const value = this.props.formData.get(key) || '';

    return (
      <FloatingInput
        key={key}
        inputKey={key}
        type={type}
        placeholder={placeholder}
        onChange={this.onChangeCached(key)}
        value={value}
        props={props}
      />
    );
  }
  renderForm() {
    return (
      <Form>
        {this.renderInputField('email', 'email', 'Email', { autoFocus: true })}
        {this.renderInputField('firstName', 'text', 'First name')}
        {this.renderInputField('lastName', 'text', 'Last name')}
        {this.renderInputField('password', 'password', 'Password', { onKeyDown: this.handleKeyDown })}
      </Form>
    );
  }
  renderFormError() {
    const { getLoading } = this.props;

    return (
      <ErrorLabel>{getLoading('signupButton').error}</ErrorLabel>
    )
  }
  renderFooter() {
    const { inviter, isLoading, getLoading } = this.props;

    return (
      <Footer>
        {getLoading('signupButton').error && this.renderFormError()}
        <CompatibleButton title="Sign up" onClick={this.onSignup} {...getLoading('signupButton')}/>
        <Switch>
          Already have an account? <LinkButton to="/login" className="footer__switch-button">Sign in here</LinkButton>
        </Switch>
        <FooterSentence>
          By signing up you agree to the <a target="_blank" href="http://swipesapp.com/workspacepolicies.pdf">Terms of service</a>
        </FooterSentence>
      </Footer>
    );
  }
  render() {
    return (
      <Wrapper>
        {this.renderHeader()}
        {this.renderForm()}
        {this.renderFooter()}
      </Wrapper>
    );
  }
}

export default CompatibleSignup;
