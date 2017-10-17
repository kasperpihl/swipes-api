import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
// import PropTypes from 'prop-types';
import { setupLoading } from 'swipes-core-js/classes/utils';
import { connect } from 'react-redux';
import * as a from 'actions';
import ParsedText from "react-native-parsed-text";
import * as gs from 'styles';
import RippleButton from 'RippleButton';
import Icon from 'Icon';

const styles = StyleSheet.create({
  container: {
    ...gs.mixins.size(1),
    ...gs.mixins.flex('column', 'center', 'top'),
    ...gs.mixins.padding(50, 30, 0, 30),
  },
  title: {
    ...gs.mixins.font(24, gs.colors.deepBlue100, '300'),
    marginBottom: 30,
  },
  paragraph: {
    ...gs.mixins.font(14, gs.colors.deepBlue60, 18),
    marginTop: 15,
    textAlign: 'center'
  },
  url: {
    ...gs.mixins.font(14, gs.colors.blue100, 18),
  },
  logOutButton: {
  },
  logOut: {
    ...gs.mixins.border(1, gs.colors.deepBlue100),
    ...gs.mixins.borderRadius(3),
    marginTop: 30,
  },
  logOutLabel: {
    ...gs.mixins.padding(15, 30),
  },
  loader: {
    ...gs.mixins.padding(15),
    marginTop: 30,
    }
});

class HOCNoOrg extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    setupLoading(this);

    this.onOpenUrl = this.onOpenUrl.bind(this);
    this.onLogOut = this.onLogOut.bind(this);
  }
  componentDidMount() {
  }
  getSVGSize(oldWidth, newWidth, oldHeight) {
    const newHeight = (newWidth * oldHeight) / oldWidth;

    return newHeight;
  }
  onOpenUrl() {
    const { browser, apiUrl } = this.props;

    browser(`${apiUrl}/login`);
  }
  onLogOut() {
    const { signout } = this.props;

    this.setLoading('loggingout');

    signout().then(() => {
      this.clearLoading('loggingout')
    });
  }
  renderLogoutButton() {
    const isLoading = this.isLoading('loggingout');

    if (isLoading) {
      return (
        <View style={styles.loader}>
          <ActivityIndicator color={gs.colors.blue100} size="small" />
        </View>
      )
    }

    return (
      <RippleButton style={styles.logOutButton} onPress={this.onLogOut}>
        <View style={styles.logOut}>
          <Text selectable={true} style={styles.logOutLabel}>Log out</Text>
        </View>
      </RippleButton>
    )
  }
  render() {
    const svgHeight = this.getSVGSize(480, (gs.layout.width - 60), 300);

    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          Seems like you are not part of an organization yet.
        </Text>
        <Icon name="ESWelcome" width={(gs.layout.width - 60)} height={svgHeight} />
        <ParsedText
          style={styles.paragraph}
          parse={[
            { pattern: /workspace.swipesapp.com/i, style: styles.url, onPress: this.onOpenUrl },
          ]}
        >
          You can join your team’s organization or create a new one. Go to workspace.swipesapp.com
        </ParsedText>
        
        {this.renderLogoutButton()}
      </View>
    );
  }
}
// const { string } = PropTypes;

HOCNoOrg.propTypes = {};

const mapStateToProps = (state) => ({
  apiUrl: state.getIn(['globals', 'apiUrl'])
});

export default connect(mapStateToProps, {
  browser: a.links.browser,
  signout: a.main.signout
})(HOCNoOrg);
