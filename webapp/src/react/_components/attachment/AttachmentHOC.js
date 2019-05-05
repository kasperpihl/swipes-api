import { connect } from 'react-redux';

import useNav from 'src/react/_hooks/useNav';
import * as mainActions from 'src/redux/main/mainActions';

export default connect()(AttachmentHOC);

function AttachmentHOC({ attachment, children, dispatch }) {
  const nav = useNav();

  let icon = 'File';
  if (attachment.type === 'url') {
    icon = 'Hyperlink';
  }
  if (attachment.type === 'note') {
    icon = 'Note';
  }

  const handleClick = () => {
    const type = attachment.type;
    if (type === 'url') {
      return dispatch(mainActions.browser(nav.side, attachment.id));
    }
    if (type === 'note') {
      return nav.openRight({
        screenId: 'Note',
        crumbTitle: 'Note',
        props: {
          noteId: attachment.id
        }
      });
    }

    nav.openRight({
      screenId: 'File',
      crumbTitle: 'File',
      props: {
        fileId: attachment.id
      }
    });
  };
  if (typeof children !== 'function') {
    throw Error('AttachmentHOC expects children to be a function');
  }

  return children(icon, handleClick);
}
