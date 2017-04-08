import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { connect } from 'react-redux';
import HOCHeader from '../../components/header/HOCHeader';
import { viewSize, colors } from '../../utils/globalStyles';

class HOCProfile extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};

    this.onActionButton = this.onActionButton.bind(this);
  }
  componentDidMount() {
    if (this.props.isActive) {
      this.renderActionButtons();
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (!prevProps.isActive && this.props.isActive) {
      this.renderActionButtons();
    }
  }
  onActionButton(i) {
    // console.log('action!', i);
  }
  renderActionButtons() {
    this.props.setActionButtons({
      onClick: this.onActionButton,
      buttons: [{ text: 'Sign Out' }],
    });
  }
  renderHeader() {
    return <HOCHeader title="Profile" />;
  }
  renderProfile() {
    const { me } = this.props;

    if (me.get('profile_pic')) {
      return (
        <Image
          source={{ uri: me.get('profile_pic') }}
          style={styles.profileImage}
        />
      );
    }

    const initials = me.get('first_name').substring(0, 1) + me.get('last_name').substring(0, 1);

    return (
      <View style={styles.initialsView}>
        <Text style={styles.initialsLetters}>{initials}</Text>
      </View>
    );
  }
  render() {
    const { me } = this.props;

    return (
      <View style={styles.container}>
        {this.renderHeader()}
        <View style={styles.profile}>
          {this.renderProfile()}
          <Text style={styles.name}>{me.get('first_name')} {me.get('last_name')}</Text>
          <View style={styles.seperator} />
          <Text style={styles.orgName}>{me.getIn(['organizations', 0, 'name'])}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgColor,
  },
  profile: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.bgColor,
    paddingTop: (viewSize.height * 15) / 100,
  },
  profileImage: {
    width: 96,
    height: 96,
    borderRadius: 50,
  },
  initialsView: {
    width: 96,
    height: 96,
    borderRadius: 50,
    backgroundColor: colors.deepBlue100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initialsLetters: {
    fontSize: 30,
    color: colors.bgColor,
    fontWeight: '700',
  },
  name: {
    fontSize: 30,
    color: colors.deepBlue80,
    fontWeight: '700',
    marginTop: (viewSize.height * 5) / 100,
  },
  orgName: {
    fontSize: 15,
    color: colors.deepBlue30,
  },
  seperator: {
    width: (viewSize.width * 40) / 100,
    height: 1,
    marginVertical: 15,
    backgroundColor: colors.deepBlue20,
  },
});

function mapStateToProps(state) {
  return {
    me: state.get('me'),
  };
}

export default connect(mapStateToProps, {})(HOCProfile);
