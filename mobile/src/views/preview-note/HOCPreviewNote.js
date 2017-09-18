import React, { PureComponent } from 'react';
import { View, WebView, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import * as a from 'actions';
import { dayStringForDate } from 'swipes-core-js/classes/time-utils';
import { bindAll } from 'swipes-core-js/classes/utils';
// import * as ca from 'swipes-core-js/actions';
// import { setupLoading } from 'swipes-core-js/classes/utils';
// import { map, list } from 'react-immutable-proptypes';
// import { fromJS } from 'immutable';
import HOCHeader from 'HOCHeader';
import { colors } from 'globalStyles';

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
});

class HOCPreviewNote extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showingInfoTab: false,
    };

    bindAll(this, ['onWebviewMessage', 'renderLoading', 'onActionButton', 'onActionPress', 'onInfoTabClose'])
  }
  componentDidMount() {
    this.renderActionButtons();
  }
  componentWillUpdate(nextProps, nextState) {
    if (!this.props.isActive && nextProps.isActive || this.state.showingInfoTab !== nextState.showingInfoTab) {
      this.renderActionButtons(nextState.showingInfoTab);
    }
  }
  onWebviewMessage(e) {
    const data = JSON.parse(e.nativeEvent.data);
    const { browser } = this.props;

    if (data.action === 'url') {
      browser(data.value);
    }
  }
  onActionPress(index) {
    console.warn('infotab action', index)
  }
  onInfoTabClose() {
    if (this.state.showingInfoTab) {
      this.setState({ showingInfoTab: false });
    }
  }
  generateNoteUrl() {
    const { token, orgId, noteId } = this.props;

    return `${window.__API_URL__}/note.html?token=${token}&note_id=${noteId}&organization_id=${orgId}`;
  }
  onActionButton(i) {
    const { noteId, noteTitle, navPush, toggleInfoTab } = this.props;
    const { showingInfoTab } = this.state;

    if (showingInfoTab) {
      if (i === 0) {
        toggleInfoTab();
        this.setState({ showingInfoTab: false })
      }
    } else {
      if (i === 0) {
        navPush({
          id: 'PostFeed',
          title: 'Discussions',
          props: {
            context: {
              title: noteTitle,
              id: noteId,
            }
          },
        });
      } else if (i === 1) {
        // const createdLbl = `${dayStringForDate(note.get('created_at'))} by ${msgGen.users.getFullName(note.get('created_by'))}`
        this.setState({ showingInfoTab: true });

        toggleInfoTab({
          onPress: this.onActionPress,
          onClose: this.onInfoTabClose,
          info: [
            { title: 'Created', text: 'Need real text here' },
          ],
          about: {
            title: 'What is a note',
            text: 'A Note is a place to document any information regarding a goal or a discussion. You can write requirements, client lists, blog posts drafts etc.\n\nTo add styles, headlines, checkboxes or bullet points, mark the text with your mouse and the options will appear.',
          },
        })
      }
    }
  }
  renderActionButtons(showingInfoTab) {
if (showingInfoTab) {
      this.props.setActionButtons({
        onClick: this.onActionButton,
        buttons: [
          { icon: 'Close', seperator: 'left', staticSize: true, alignEnd: true }
        ],
      });
    } else {
      this.props.setActionButtons({
        onClick: this.onActionButton,
        buttons: [
          { text: 'Discussions' },
          { icon: 'Info', seperator: 'left', staticSize: true }
        ],
      });
    }
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
        icon="Note"
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
  toggleInfoTab: a.infotab.showInfoTab,
})(HOCPreviewNote);
