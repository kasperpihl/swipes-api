import React, { PureComponent } from 'react';
import { View, WebView, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
// import * as a from 'actions';
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
  }
  componentDidMount() {
  }
  onWebviewMessage(data) {
    console.log(data);
  }
  generateNoteUrl() {
    const { token, orgId, noteId } = this.props;

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
})(HOCPreviewNote);
