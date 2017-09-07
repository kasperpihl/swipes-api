import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import codePush from 'react-native-code-push';
import { connect } from 'react-redux';
import * as a from '../../actions';
import HOCHeader from '../../components/header/HOCHeader';
import RippleButton from '../../components/ripple-button/RippleButton';
import { viewSize, colors } from '../../utils/globalStyles';

class HOCProfile extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};

    this.onActionButton = this.onActionButton.bind(this);
    this.onLogOut = this.onLogOut.bind(this);
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
  onLogOut() {
    const { signout } = this.props;

    signout();
  }
  onActionButton(i) {
    // console.log('action!', i);
  }
  onUpdate() {
    codePush.sync({ installMode: codePush.InstallMode.IMMEDIATE });
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

    if (msgGen.users.getPhoto(me)) {
      return (
        <Image
          source={{ uri: msgGen.users.getPhoto(me) }}
          style={styles.profileImage}
        />
      );
    }

    const initials = msgGen.users.getInitials(me);

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
          <Text style={styles.name}>{msgGen.users.getFullName(me)}</Text>
          <View style={styles.seperator} />
          <Text style={styles.orgName}>{me.getIn(['organizations', 0, 'name'])}</Text>

          <RippleButton style={styles.logOutButton} onPress={this.onLogOut}>
            <View style={styles.logOut}>
              <Text style={styles.logOutLabel}>Log out</Text>
            </View>
          </RippleButton>
          <RippleButton style={styles.logOutButton} onPress={this.onUpdate}>
            <View style={styles.logOut}>
              <Text style={styles.logOutLabel}>Update</Text>
            </View>
          </RippleButton>
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
  logOutButton: {
  },
  logOut: {
    borderColor: colors.deepBlue100,
    borderWidth: 1,
    marginTop: 30,
    borderRadius: 3,
  },
  logOutLabel: {
    paddingVertical: 15,
    paddingHorizontal: 30,
  }
});

function mapStateToProps(state) {
  return {
    me: state.get('me'),
  };
}

export default connect(mapStateToProps, {
  signout: a.main.signout
})(HOCProfile);
