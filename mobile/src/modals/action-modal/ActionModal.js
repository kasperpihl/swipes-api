import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { Modal, Text, View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { bindAll } from 'swipes-core-js/classes/utils';
import * as a from 'actions';
import { colors, viewSize, statusbarHeight } from 'globalStyles';
import RippleButton from 'RippleButton';
import Icon from 'Icon';
import ActionModalList from './ActionModalList';


// define your styles
const styles = StyleSheet.create({
  modalBox: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.bgColor,
  },
  titleWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 15,
  },
  title: {
    flex: 1,
    fontSize: 18,
    color: colors.deepBlue100,
  },
  actionTitle: {
    flex: 1,
    fontSize: 14,
    color: colors.deepBlue80,
    paddingLeft: 15,
  },
  ctaButton: {
    flex: 1,
    alignSelf: 'stretch',
    maxHeight: 54,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cta: {
    flex: 1,
    maxHeight: 54,
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.bgColor,
    borderTopWidth: 2,
    borderTopColor: colors.deepBlue10
  },
  ctaTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    lineHeight: 24,
    color: colors.blue100,
    includeFontPadding: false,
    paddingBottom: 2,
  },
});


export default class ActionModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedIds: fromJS(props.selectedIds || []),
    }
    bindAll(this, ['onActionPress', 'onClose']);
    // this.onButtonClick = setupCachedCallback(this.onButtonClick, this);
  }
  onItemPress(itemId, item, e) {
    let { selectedIds } = this.state;
    const { multiple, onItemPress, closeModal } = this.props;

    if(multiple && !itemId) {
      console.warn('items for action modal should have id to use multiselect');
    }
    if (multiple && itemId) {
      if(!selectedIds.contains(itemId)) {
        selectedIds = selectedIds.push(itemId);
      } else {
        selectedIds = selectedIds.filter(id => id !== itemId);
      }
      this.setState({ selectedIds });
    } else if(onItemPress) {
      closeModal();
      onItemPress(itemId, item, e);
    }
  } 
  onActionPress(e) {
    const { selectedIds } = this.state;
    const { onActionPress, closeModal } = this.props;
    closeModal();
    if(onActionPress){
      onActionPress(selectedIds, e);
    }
    
  }
  onClose() {
    const { closeModal } = this.props;
    closeModal();
  }

  renderCloseButton() {
    const { fullscreen } = this.props;

    if (!fullscreen) {
      return undefined;
    }

    const closeButtonStyles = {
      width: 60,
      height: 60,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: -15,
    };

    return (
      <RippleButton 
        style={closeButtonStyles} 
        rippleColor={colors.deepBlue60} 
        rippleOpacity={0.8} 
        onPress={this.onClose}>
        <View style={closeButtonStyles}>
          <Icon name="Close" width="24" height="24" fill={colors.deepBlue80} />
        </View>
      </RippleButton>
    );
  }
  renderTitle() {
    const { title, fullscreen } = this.props;

    if (title) {
      let titleStyles = {
        height: 60,
      };

      if (fullscreen) {
        titleStyles = {
          height: 90,
          borderBottomWidth: 1,
          borderBottomColor: colors.deepBlue10,
        };
      }

      return (
        <View style={[styles.titleWrapper, titleStyles]}>
          <Text selectable={true} style={styles.title}>
            {title}
          </Text>
          {this.renderCloseButton()}
        </View>
      );
    }

    return undefined;
  }
  renderList() {
    const { items, fullscreen, scrollable, multiple } = this.props;
    const { selectedIds } = this.state;

    if (items) {
      return (
        <ActionModalList 
          selectedIds={selectedIds}
          listItems={items}
          fullscreen={fullscreen}
          scrollable={scrollable} 
          multiple={multiple} 
          delegate={this} 
        />
      );
    }

    return undefined;
  }
  renderAction() {
    const { multiple, actionLabel } = this.props;

    if (multiple) {
      return (
        <RippleButton
          rippleColor={colors.blue100}
          rippleOpacity={0.8}
          style={styles.ctaButton}
          onPress={this.onActionPress}
        >
          <View style={styles.cta}>
            <Text selectable={true} style={styles.ctaTitle}>{actionLabel || 'Confirm'}</Text>
          </View>
        </RippleButton>
      );
    }

    return undefined;
  }
  render() {
    const { fullscreen } = this.props;
    let modalStyles = {
      width: viewSize.width * 0.8,
      maxWidth: 275,
      elevation: 5,
      shadowColor: colors.deepBlue100,
      shadowOffset: {
        width: 0, height: 1,
      },
      shadowOpacity: 0.2,
      shadowRadius: 3,
    };

    let animationStyle = 'fade';

    if (fullscreen) {
      modalStyles = {
        width: viewSize.width,
        height: viewSize.height + statusbarHeight,
      };
      animationStyle = 'slide';
    }

    return (
      <View style={[styles.modalBox, modalStyles]}>
        {this.renderTitle()}
        {this.renderList()}
        {this.renderAction()}
      </View>
    );
  }
}
