import {
  convertToRaw,
  convertFromRaw,
  SelectionState,
  Modifier,
} from 'draft-js';

export default (editorState) => {
  const contentState = editorState.getCurrentContent();
  let blockMap = contentState.getBlockMap();
  let newContentState = contentState;

  blockMap.forEach((contentBlock, blockKey) => {
    
    let ranges = [];
    let apiString;
    let extraOffset = 0;

    contentBlock.findEntityRanges(
      (character) => {
      
        const entity = character.getEntity();
      
        if(entity !== null &&
          contentState.getEntity(entity).get('type') === 'MENTION') {
          apiString = contentState.getEntity(entity).get('data').apiString;
          return true;
        }
      
        return false;
      
      },
      (anchorOffset, focusOffset) => {
        
        let selectionState = SelectionState.createEmpty(blockKey);
        
        selectionState = selectionState.merge({
          focusOffset: focusOffset + extraOffset,
          anchorOffset: anchorOffset + extraOffset, 
        });
        
        // offset the next selection range with difference in text
        extraOffset += apiString.length - (focusOffset - anchorOffset);
        
        newContentState = Modifier.replaceText(
          newContentState,
          selectionState,
          apiString,
          null,
          null, // make sure to remove entity from range
        );
      
      },
    );
  })
  return newContentState.getPlainText();
}