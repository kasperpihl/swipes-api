import React, { PureComponent } from 'react';
import { View, WebView, StyleSheet, Platform } from 'react-native';
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
});

class HOCPreviewNote extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this.onWebviewMessage = this.onWebviewMessage.bind(this);
  }
  componentDidMount() {
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
    console.log(`${window.__API_URL__}/note.html?token=${token}&note_id=${noteId}&organization_id=${orgId}`);
    return `${window.__API_URL__}/note.html?token=${token}&note_id=${noteId}&organization_id=${orgId}`;
  }

  renderHeader() {
    const { noteTitle } = this.props;

    return (
      <HOCHeader
        title={noteTitle}
      />
    );
  }
  renderWebview() {
    return (
      <WebView
        source={{ uri: this.generateNoteUrl() }}
        scalesPageToFit
        style={styles.webviewStyles}
        onMessage={this.onWebviewMessage}
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
