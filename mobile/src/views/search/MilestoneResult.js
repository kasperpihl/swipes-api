import React, { PureComponent } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'Icon';
import { colors } from 'globalStyles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 61,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.deepBlue10,
    paddingHorizontal: 6,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 3,
    backgroundColor: colors.deepBlue5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleWrapper: {
    flex: 1,
    paddingLeft: 12,
    paddingRight: 6,
  },
  title: {
    alignSelf: 'stretch',
    fontSize: 15,
    color: colors.deepBlue90,
    lineHeight: 24,
    includeFontPadding: false,
  },
})

class MilestoneResult extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
  }
  render() {
    const { result } = this.props;

    return (
      <View style={styles.container} >
        <View style={styles.iconWrapper} >
          <Icon name="MiniMilestone" width="18" height="18" fill={colors.deepBlue100} />
        </View>
        <View style={styles.titleWrapper}>
          <Text selectable={true} style={styles.title} ellipsizeMode="tail" numberOfLines={1}>{result.item.title}</Text>
        </View>
      </View>
    );
  }
}

export default MilestoneResult;
