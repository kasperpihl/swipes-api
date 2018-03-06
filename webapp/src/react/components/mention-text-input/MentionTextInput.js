import React, { PureComponent } from 'react';
import { MentionsInput, Mention } from 'react-mentions'
import ResultItem from 'components/result-item/ResultItem';
// import PropTypes from 'prop-types';
// import { map, list } from 'react-immutable-proptypes';
// import { bindAll } from 'swipes-core-js/classes/utils';
import { setupDelegate } from 'react-delegate';
// import SWView from 'SWView';
// import Button from 'Button';
// import Icon from 'Icon';
import './styles/mention-text-input.scss';

class MentionTextInput extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    setupDelegate(this, 'onTextChange', 'onFindUsers');
  }
  renderSuggestion(entry, search, highlightedDisplay, index) {
    const user = msgGen.users.getUser(entry.id);
    let leftIcon = { src: msgGen.users.getPhoto(user) };
    if(!leftIcon.src) {
      leftIcon = {
        initials: {
          color: 'white',
          backgroundColor: '#000C2F',
          letters: msgGen.users.getInitials(user),
        },
      };
    }
    return (
      <ResultItem
        title={msgGen.users.getFullName(user)}
        leftIcon={leftIcon}
      />
    );
  }
  render() {
    const {
      value,
      className,
      delegate,
      onChange,
      onTop,
      style,
      ...rest,
    } = this.props;
    const reverseStyles = {
      'marginTop': '0',
      transform: 'translateY(-100%)',
    };
    let appliedStyles = style || {};
    if(onTop) {
      appliedStyles.suggestions = Object.assign({}, appliedStyles.suggestions, reverseStyles);
    }
    return (
      <MentionsInput
        className="mention-text"
        ref="textarea"
        value={value} 
        onChange={this.onTextChange}
        style={appliedStyles}
        {...rest}>
        <Mention trigger="@"
          type="users"
          data={this.onFindUsers}
          renderSuggestion={this.renderSuggestion} />
      </MentionsInput>
    );
  }
}

export default MentionTextInput

// const { string } = PropTypes;

MentionTextInput.propTypes = {};