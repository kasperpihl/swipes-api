import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as a from 'actions';
import * as ca from 'swipes-core-js/actions';
// import * s from 'selectors';
// import * as cs from 'swipes-core-js/selectors';
import { setupLoading, bindAll } from 'swipes-core-js/classes/utils';
import { setupDelegate } from 'react-delegate';
// import { map, list } from 'react-immutable-proptypes';
// import { fromJS } from 'immutable';
import Button from 'Button';
import { fromJS } from 'immutable';
import {
  EditorState,
  convertToRaw,
} from 'draft-js';

import './styles/attach-button.scss';

class HOCAttachButton extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      fileVal: '',
    };
    setupDelegate(this, 'onAddedAttachment', 'onAttachButtonCloseOverlay');
    setupLoading(this);
    bindAll(this, ['onChooseAttachment', 'onChangeFiles']);
  }
  componentDidMount() {
  }
  onChangeFiles(e) {
    this.setState({ fileVal: e.target.value });
    this.onUploadFiles(e.target.files);
  }
  onUploadFiles(files) {
    const { createFile } = this.props;
    this.setLoading('attach');
    createFile(files).then((res) => {
      if (res.ok) {
        this.createLinkFromTypeIdTitle('file', res.file.id, res.file.original_title);
        this.setState({ fileVal: '' });
      } else {
        this.clearLoading('attach', '!Something went wrong');
      }
    });
  }
  onChooseAttachment(e) {
    const { chooseAttachmentType, inputMenu, createNote } = this.props;
    const options = this.getOptionsForE(e);
    options.onClose = this.onAttachButtonCloseOverlay;
    chooseAttachmentType(options).then((item) => {
      if (item.id === 'upload') {
        this.refs.upload.click();
        return;
      }
      options.buttonLabel = 'Add';
      if (item.id === 'note') {
        options.placeholder = 'Title of the note';
      } else if (item.id === 'url') {
        options.placeholder = 'http://';
      }
      inputMenu(options, (title) => {
        if (title && title.length) {
          this.setLoading('attach');
          if (item.id === 'url') {
            this.createLinkFromTypeIdTitle(item.id, title, title);
          } else {
            createNote(convertToRaw(EditorState.createEmpty().getCurrentContent())).then((res) => {
              if (res && res.ok) {
                this.createLinkFromTypeIdTitle(item.id, res.note.id, title);
              } else {
                this.clearLoading('attach');
              }
            });
          }
        }
      });
    })
  }
  getSwipesLinkObj(type, id, title) {
    const { myId } = this.props;
    return {
      service: {
        name: 'swipes',
        type,
        id,
      },
      permission: {
        account_id: myId,
      },
      meta: {
        title,
      },
    };
  }
  getOptionsForE(e) {
    return {
      boundingRect: e.target.getBoundingClientRect(),
      alignX: 'center',
    }
  }
  createLinkFromTypeIdTitle(type, id, title) {
    const link = this.getSwipesLinkObj(type, id, title);
    const { createLink } = this.props;
    createLink(link).then((res) => {
      let clear = undefined;
      if (res.ok) {
        const att = fromJS({ link: res.link, title });
        clear = this.onAddedAttachment(att, this.clearLoading.bind(null, 'attach'));
      }
      if(clear === undefined){
        this.clearLoading('attach');
      }
    });
  }
  render() {
    const { fileVal } = this.state;
    const {
      className,
      delegate,
      myId,
      inputMenu,
      chooseAttachmentType,
      createLink,
      createNote,
      createFile,
      ...rest,
    } = this.props;

    return (
      <div className={`attach-button ${className||''}`}>
        <Button
          className="attach-button__button"
          onClick={this.onChooseAttachment}
          {...this.getLoading('attach')}
          icon="Attach"
          {...rest}
        />
        <input
          className="attach-button__hidden-input"
          value={fileVal}
          ref="upload"
          type="file"
          onChange={this.onChangeFiles}
        />
      </div>
    );
  }
}
// const { string } = PropTypes;

HOCAttachButton.propTypes = {};

function mapStateToProps(state) {
  return {
    myId: state.getIn(['me', 'id']),
  };
}

export default connect(mapStateToProps, {
  inputMenu: a.menus.input,
  chooseAttachmentType: a.menus.chooseAttachmentType,
  createLink: ca.links.create,
  createNote: ca.notes.create,
  createFile: ca.files.create,
})(HOCAttachButton);
