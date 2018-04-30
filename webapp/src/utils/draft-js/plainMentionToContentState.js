import {
  ContentState,
  SelectionState,
  Modifier,
} from 'draft-js';

export default (plainString) => {
  let contentState = ContentState.createFromText(plainString);
  const blockMap = contentState.getBlockMap();

  blockMap.forEach((contentBlock, blockKey) => {
    let selection = SelectionState.createEmpty(blockKey);
    const text = contentBlock.getText();
    const REGEX = /<![A-Z0-9]*\|(.*?)>/gi;
    let result;
    let indexModifier = 0;
    while (result = REGEX.exec(text)) {
      const index = result.index + indexModifier;
      const apiString = result[0];
      const displayName = result[1];
      indexModifier += (displayName.length - apiString.length);
      
      selection = selection.merge({
        anchorOffset: index, 
        focusOffset: index + apiString.length,
      });

      contentState = contentState.createEntity(
        'MENTION',
        'IMMUTABLE',
        {
          apiString,
        },
      );

      contentState = Modifier.replaceText(
        contentState,
        selection,
        displayName,
        null,
        contentState.getLastCreatedEntityKey(),
      );
    }
  });
  
  return contentState; 
}