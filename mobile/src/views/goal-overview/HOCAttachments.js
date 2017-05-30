import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, Platform, UIManager, LayoutAnimation } from 'react-native';
import { connect } from 'react-redux';
import ImmutableListView from 'react-native-immutable-list-view';
import ImagePicker from 'react-native-image-picker';
import { attachmentIconForService, setupCachedCallback } from '../../../swipes-core-js/classes/utils';
import EmptyListFooter from '../../components/empty-list-footer/EmptyListFooter';
import Icon from '../../components/icons/Icon';
import * as a from '../../actions';
import RippleButton from '../../components/ripple-button/RippleButton';
import { colors } from '../../utils/globalStyles';


class HOCAttachments extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};

    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    this.renderAttachment = this.renderAttachment.bind(this);
    this.onAddAttachment = this.onAddAttachment.bind(this);
    this.attachmentPress = setupCachedCallback(this.attachmentPress, this);
  }
  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }
  onAddAttachment() {
    const options = {
      title: 'Select Avatar',
      customButtons: [
        { name: 'fb', title: 'Choose Photo from Facebook' },
      ],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = { uri: response.uri };

        console.log(response);

        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };
      }
    });
  }
  attachmentPress(att) {
    const { preview } = this.props;

    preview(att);
  }
  renderAttachment(attachment) {
    const { attachments } = this.props;

    const at = attachments.get(attachment);
    const icon = attachmentIconForService(at.getIn(['link', 'service']) || at);

    return (
      <RippleButton rippleColor={colors.deepBlue60} style={styles.attachment} rippleOpacity={0.8} key={attachment} onPress={this.attachmentPress(at)}>
        <View style={styles.attachment}>
          <View style={styles.icon}>
            <Icon name={icon} width="24" height="24" fill={colors.blue100} />
          </View>
          <Text style={styles.label} ellipsizeMode="tail">{at.get('title')}</Text>
        </View>
      </RippleButton>
    );
  }
  renderFooter() {
    return <EmptyListFooter />;
  }
  renderAttachmentList() {
    const {
      attachmentOrder,
    } = this.props;

    return (
      <ImmutableListView
        removeClippedSubviews={false}
        immutableData={attachmentOrder}
        renderRow={this.renderAttachment}
        renderFooter={this.renderFooter}
      />
    );
  }
  renderFAB() {
    return (
      <View style={styles.fabWrapper}>
        <RippleButton rippleColor={colors.bgColor} rippleOpacity={0.5} style={styles.fabButton} onPress={this.onAddAttachment}>
          <View style={styles.fabButton}>
            <Icon name="Plus" width="24" height="24" fill={colors.bgColor} />
          </View>
        </RippleButton>
      </View>
    );
  }
  render() {
    return (
      <View style={styles.container}>
        {this.renderAttachmentList()}

        {this.renderFAB()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  attachment: {
    flex: 1,
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  icon: {
    paddingRight: 18,
  },
  label: {
    color: colors.deepBlue100,
    fontSize: 18,
  },
  fabWrapper: {
    width: 60,
    height: 60,
    borderRadius: 60 / 2,
    position: 'absolute',
    bottom: 30,
    right: 15,
  },
  fabButton: {
    width: 60,
    height: 60,
    borderRadius: 60 / 2,
    backgroundColor: colors.blue100,
    alignItems: 'center',
    justifyContent: 'center',
  },
});


function mapStateToProps(state) {
  return {
    me: state.get('me'),
  };
}

export default connect(mapStateToProps, {
  preview: a.links.preview,
})(HOCAttachments);
