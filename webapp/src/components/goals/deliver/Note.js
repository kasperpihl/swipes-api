import React, { Component, PropTypes } from 'react'
import Button from '../../swipes-ui/Button'

import '../styles/note.scss'
import {
  Editor,
  createEditorState
} from 'medium-draft';
import {
  convertFromRaw,
  EditorState,
  convertToRaw
} from 'draft-js'

class Note extends Component {
  static actionTile(){
    return "Create Note";
  }
  static previewForData(data){

  }
  constructor(props) {
    super(props)
    const index = props.step.get('id') + '-note';
    let editorState = createEditorState();
    let localState = localStorage.getItem(index);

    if(!localState){
      const data = props.step.get('data');
      localState = JSON.stringify(data.get('initialData').toJS());
    }
    if(localState){
      const blockData = JSON.parse(localState);
      editorState = EditorState.push(editorState, convertFromRaw(blockData));
    }


    this.state = { editorState };
    this.onChange = (editorState) => {
      const index = this.props.step.get('id') + '-note';
      localStorage.setItem(index, JSON.stringify(convertToRaw(editorState.getCurrentContent())))
      this.setState({ editorState });
    };
    this.clickedSubmit = this.clickedSubmit.bind(this);
  }
  clickedSubmit(){
    const { step, completeStep } = this.props;

    completeStep(step.get('id'));
  }
  componentDidMount() {
  }
  renderSubmit(){
    const { step } = this.props;
    if(!step.get('completed')){
      return <Button title="Submit" callback={this.clickedSubmit} style={{marginTop: '30px'}} />
    }
  }
  render() {
    const {editorState} = this.state;
    return (
      <div className="deliver-note">
        <Editor
          editorState={editorState}
          onChange={this.onChange}
        />
        {this.renderSubmit()}
      </div>
    )
  }
}
export default Note

const { string } = PropTypes;
import { map, mapContains, list, listOf } from 'react-immutable-proptypes'
Note.propTypes = {
}
