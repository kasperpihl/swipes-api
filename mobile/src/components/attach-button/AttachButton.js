import React, { PureComponent } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as gs from 'styles';
// import { bindAll } from 'swipes-core-js/classes/utils';
import { setupDelegate } from 'react-delegate';
import Icon from 'Icon';

const styles = StyleSheet.create({
  attachmentContainer: {
    ...gs.mixins.size(1),
    ...gs.mixins.flex('center'),
    flex: 0,
    minWidth: 48,
    maxWidth: 48,
    minHeight: 48,
  },
  numberOfAttachments: {
    ...gs.mixins.padding(3, 8),
    ...gs.mixins.flex('center'),
    minWidth: 24,
    minHeight: 24,
    backgroundColor: '#007AFF',
    borderRadius: 24 / 2,
  },
  numberOfAttachmentsLabel: {
    ...gs.mixins.font(13, 'white'),
  }
})

class AttachButton extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    setupDelegate(this, 'onAddAttachment');
    
    this.handleAttach = this.handleAttach.bind(this);
  }
  componentDidMount() {
  }
  handleAttach() {
    this.onAddAttachment();
  }
  renderIcon() {
    const { numberOfAttachments } = this.props;
    
    if (!numberOfAttachments) {
      return <Icon name="Attachment" width="24" height="24" fill={gs.colors.blue100} />
    }
    
    return (
      <View style={styles.numberOfAttachments}>
        <Text style={styles.numberOfAttachmentsLabel}>{numberOfAttachments}</Text>
      </View>
    )
  }
  render() {
    return (
      <TouchableOpacity onPress={this.handleAttach}>
        <View style={styles.attachmentContainer}>
          {this.renderIcon()}
        </View>
      </TouchableOpacity>
    );
  }
}

export default AttachButton

// const { string } = PropTypes;

AttachButton.propTypes = {};
