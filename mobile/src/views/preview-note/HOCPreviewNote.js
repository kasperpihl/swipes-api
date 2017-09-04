import React, { PureComponent } from 'react';
import { View, WebView, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import * as a from '../../actions';
// import * as ca from 'swipes-core-js/actions';
// import { setupLoading } from 'swipes-core-js/classes/utils';
// import { map, list } from 'react-immutable-proptypes';
// import { fromJS } from 'immutable';
import HOCHeader from '../../components/header/HOCHeader';
import { colors } from '../../utils/globalStyles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: colors.bgColor,
  },
  webviewStyles: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loader: {
  },
});

class HOCPreviewNote extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      routeNum: props.lastRoute,
    };
    this.onWebviewMessage = this.onWebviewMessage.bind(this);
    this.renderLoading = this.renderLoading.bind(this);
    this.onActionButton = this.onActionButton.bind(this);
  }
  componentDidMount() {
    this.renderActionButtons();
    this.loadingTimeout = setTimeout(() => {
      this.setState({ hasLoaded: true });
    }, 1);
  }
  componentWillUpdate(nextProps) {
    if (this.state.routeNum === nextProps.lastRoute) {
      this.renderActionButtons();
    }
  }
  componentWillUnmount() {
    clearTimeout(this.loadingTimeout);
  }
  onWebviewMessage(e) {
    const data = JSON.parse(e.nativeEvent.data);
    const { browser } = this.props;

    if (data.action === 'url') {
      browser(data.value);
    }
  }
  generateNoteUrl() {
    const { token, orgId, noteId } = this.props;

    return `${window.__API_URL__}/note.html?token=${token}&note_id=${noteId}&organization_id=${orgId}`;
  }
  onActionButton(i) {
    const { noteId, noteTitle, navPush } = this.props;

    navPush({
      id: 'PostCreate',
      title: 'Create Post',
      props: {
        context: {
          title: noteTitle,
          id: noteId,
        },
      },
    });

  }
  renderActionButtons() {

    this.props.setActionButtons({
      onClick: this.onActionButton,
      buttons: [
        { text: 'Discuss' },
      ],
    });
  }
  renderLoading() {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator color={colors.blue100} size="large" style={styles.loader} />
      </View>
    );
  }
  renderHeader() {
    const { noteTitle } = this.props;

    return (
      <HOCHeader
        title={noteTitle}
        subtitle="Read only"
      />
    );
  }
  renderWebview() {
    return (
      <WebView
        source={{ uri: this.generateNoteUrl() }}
        renderLoading={this.renderLoading}
        scalesPageToFit
        style={styles.webviewStyles}
        onMessage={this.onWebviewMessage}
        startInLoadingState={true}
      />
    );
  }
  render() {
    return (
      <View style={styles.container}>
        {this.renderHeader()}
        {this.renderWebview()}
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    token: state.getIn(['connection', 'token']),
    orgId: state.getIn(['me', 'organizations', 0, 'id']),
  };
}

export default connect(mapStateToProps, {
  browser: a.links.browser,
})(HOCPreviewNote);
