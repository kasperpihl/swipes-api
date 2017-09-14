import React, { PureComponent } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import HOCAssigning from 'components/assignees/HOCAssigning';
import Icon from 'Icon';
import { colors } from 'globalStyles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 61,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.deepBlue50,
    paddingHorizontal: 6,
  },
  completedIndicator: {
    width: 24,
    height: 24,
    borderRadius: 24 / 2,
    flex: 0,
    backgroundColor: colors.greenColor,
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 10 /2,
    borderWidth: 2,
    borderColor: colors.deepBlue50,
    flex: 0,
    marginLeft: 7,
    marginRight: 7,
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
    includeFontPadding: false
  },
  assignees: {
    height: 60,
    alignItems: 'flex-end',
    justifyContent: 'center',
    flex: 0,
  }
})

class GoalResult extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
  }
  renderAssignees() {
    const { result } = this.props;
    const assignees = msgGen.goals.getAssignees(result.item.id);

    return (
      <View style={styles.assignees} >
        <HOCAssigning assignees={assignees} maxImages={1} />
      </View>
    )
  }
  renderIndicator() {
    const isCompleted = this.props.result.item.completed_at;

    if (isCompleted) {
      return (
        <View style={styles.completedIndicator} >
          <Icon name="ChecklistCheckmark" width="18" height="18" fill="white" />
        </View>
      )
    }

    return (
      <View style={styles.indicator}  />
    )
  }
  render() {
    const { result } = this.props;

    return (
      <View style={styles.container} >
        {this.renderIndicator()}
        <View style={styles.titleWrapper} >
          <Text style={styles.title} ellipsizeMode="tail" numberOfLines={1} >{result.item.title}</Text>
        </View>
        {this.renderAssignees()}
      </View>
    );
  }
}

export default GoalResult

// const { string } = PropTypes;

GoalResult.propTypes = {};
