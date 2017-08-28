import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { View, Text, StyleSheet, ActivityIndicator, Modal, TextInput } from 'react-native';
import ImmutableVirtualizedList from 'react-native-immutable-list-view';
import HOCHeader from '../../components/header/HOCHeader';
import Icon from '../../components/icons/Icon';
import RippleButton from '../../components/ripple-button/RippleButton';
import * as cs from '../../../swipes-core-js/selectors';
import * as ca from '../../../swipes-core-js/actions';
import { colors, viewSize } from '../../utils/globalStyles';
import HOCGoalItem from './HOCGoalItem';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgColor,
  },
  list: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loader: {
  },
  sectionWrapper: {
    height: 42,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: 'bold',
    color: colors.deepBlue100
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
  createActionWrapper: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonWrapper: {
    position: 'absolute',
    width: 50,
    height: 50,
    top: 45,
    right: 15,
    backgroundColor: colors.deepBlue40,
    borderRadius: 50 / 2,
  },
  closeButton: {
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputWrapper: {
    width: viewSize.width - 30,
    height: 60,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  input: {
    width: viewSize.width - 30,
    fontSize: 15,
    lineHeight: 18,
    color: colors.deepBlue100,
    paddingHorizontal: 15,
  },
  addWrapper: {
    width: viewSize.width,
    height: 54,
    position: 'absolute',
    left: 0,
    bottom: 0,
  },
  addButton: {
    width: viewSize.width,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.blue100,
  },
  addButtonTitle: {
    fontSize: 15,
    lineHeight: 18,
    fontWeight: 'bold',
    color: 'white'
  }
});

class HOCGoalList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      hasLoaded: false,
      fabOpen: false,
      text: '',
    };

    this.renderGoal = this.renderGoal.bind(this);
    this.handleFABPress = this.handleFABPress.bind(this);
    this.onGoalAdd = this.onGoalAdd.bind(this);
  }
  componentDidMount() {
    this.loadingTimeout = setTimeout(() => {
      this.setState({ hasLoaded: true });
    }, 1);
  }
  componentDidUpdate(prevProps) {
    if (!this.state.hasLoaded) {
      clearTimeout(this.loadingTimeout);

      this.loadingTimeout = setTimeout(() => {
        this.setState({ hasLoaded: true });
      }, 1);
    }
  }
  componentWillUnmount() {
    clearTimeout(this.loadingTimeout);
  }
  onPushStack(route) {
    const { navPush } = this.props;

    navPush(route);
  }
  onChangeTab(index) {
    if (index !== this.state.tabIndex) {
      this.setState({ tabIndex: index, hasLoaded: false });
    }
  }
  onGoalAdd() {
    const { myId, createGoal } = this.props;
    const { text } = this.state;

    if (text.length > 0) {
      createGoal(text, null, [myId]).then((res) => {
        if (res.ok) {
          this.setState({ fabOpen: false })
        }
      });
    }
  }
  handleFABPress() {
    const { fabOpen } = this.state;

    if (!fabOpen) {
      this.setState({ fabOpen: true })
    } else {
      this.setState({ fabOpen: false })
    }
  }
  renderHeader() {

    return (
      <HOCHeader
        title="Take Action"
        delegate={this}
      />
    );
  }
  renderSectionHeader(v1, section) {

    if (section === 'none') {
      return (
        <View style={styles.sectionWrapper}>
          <Text style={styles.sectionTitle}>No milestone</Text>
        </View>
      );
    }

    return (
      <View style={styles.sectionWrapper}>
        <Icon name="MiniGoal" fill={colors.deepBlue100} width="18" height="18" />
        <Text style={[styles.sectionTitle, { paddingLeft: 6 }]}>{msgGen.milestones.getName(section)}</Text>
      </View>
    )
  }
  renderGoal(g) {
    const gId = g.get('id');

    return <HOCGoalItem goalId={gId} key={gId} delegate={this} />;
  }
  renderListLoader() {

    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator color={colors.blue100} size="large" style={styles.loader} />
      </View>
    );
  }
  renderList() {
    const { goals } = this.props;
    const { hasLoaded } = this.state;

    if (!hasLoaded) {
      return this.renderListLoader();
    }

    return (
      <ImmutableVirtualizedList
        style={styles.list}
        immutableData={goals}
        renderRow={this.renderGoal}
        renderSectionHeader={this.renderSectionHeader}
      />
    );
  }
  renderFAB() {
    const { fabOpen } = this.state;

    if (fabOpen) {
      return undefined;
    }

    return (
      <View style={styles.fabWrapper}>
        <RippleButton rippleColor={colors.bgColor} rippleOpacity={0.5} style={styles.fabButton} onPress={this.handleFABPress}>
          <View style={styles.fabButton}>
            <Icon name="Plus" width="24" height="24" fill={colors.bgColor} />
          </View>
        </RippleButton>
      </View>
    );
  }
  renderCreateActionModal() {
    const { fabOpen } = this.state;

    return (
      <Modal
        animationType={"fade"}
        transparent={true}
        visible={fabOpen}
        onRequestClose={this.handleFABPress}
      >
        <View style={styles.createActionWrapper}>
          <View style={styles.closeButtonWrapper}>
            <RippleButton rippleColor={colors.bgColor} rippleOpacity={0.5} style={styles.closeButton} onPress={this.handleFABPress}>
              <View style={styles.closeButton}>
                <Icon name="Close" width="24" height="24" fill={colors.bgColor} />
              </View>
            </RippleButton>
          </View>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              onChangeText={(text) => this.setState({text})}
              underlineColorAndroid="transparent"
              placeholder="Add a new goal"
            />
          </View>
          <View style={styles.addWrapper}>
            <RippleButton rippleColor={colors.bgColor} rippleOpacity={0.5} style={styles.addButton} onPress={this.onGoalAdd}>
              <View style={styles.addButton}>
                <Text style={styles.addButtonTitle}>Create new action</Text>
              </View>
            </RippleButton>
          </View>
        </View>
      </Modal>
    )
  }
  render() {
    return (
      <View style={styles.container}>
        {this.renderHeader()}
        <View style={styles.list}>
          {this.renderList()}
        </View>
        {this.renderFAB()}
        {this.renderCreateActionModal()}
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    goals: cs.goals.assignedGroupedByMilestone(state),
    myId: state.getIn(['me', 'id']),
  };
}

export default connect(mapStateToProps, {
  createGoal: ca.goals.create,
})(HOCGoalList);
