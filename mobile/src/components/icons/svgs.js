import React from 'react';
import { G, Path, Polygon, Circle } from 'react-native-svg';

const DEF_VIEWBOX = '0 0 24 24';

export default {
  AddPerson: {

  },
  ArrowLeftLine: {
    svg: <Polygon points="14.1,6.3 15.6,7.7 11.3,12 15.6,16.3 14.1,17.7 8.4,12" />,
    viewBox: DEF_VIEWBOX
  },
  ArrowRightFull: {

  },
  ArrowRightLine: {

  },
  Assign: {

  },
  Breadcrumb: {

  },
  Calendar: {

  },
  Checklist: {

  },
  ChecklistCheckmark: {

  },
  Checkmark: {

  },
  Circle: {

  },
  CircleCheckmark: {

  },
  Close: {

  },
  CloseSmall: {

  },
  Collection: {

  },
  CreateNote: {

  },
  Deliver: {

  },
  Dot: {

  },
  Email: {

  },
  Eye: {

  },
  Find: {
    svg: <Path d="M21,19.293l-4.1064-4.1065a7.01913,7.01913,0,1,0-1.4141,1.4141L19.586,20.707ZM6.293,11a5,5,0,1,1,5,5A5.0058,5.0058,0,0,1,6.293,11Z" />,
    viewBox: DEF_VIEWBOX
  },
  Flag: {

  },
  Folder: {

  },
  Goals: {

  },
  Goal: {

  },
  GotAssigned: {

  },
  GotNotified: {

  },
  GotUnassigned: {

  },
  Hashtag: {

  },
  Handoff: {

  },
  LogoLoader: {

  },
  Logout: {

  },
  Milestones: {

  },
  Minus: {

  },
  Note: {

  },
  Notification: {

  },
  Person: {
    svg: (
      <G>
        <Path d="M19,18H5a5,5,0,0,1,5-5h4a5,5,0,0,1,5,5Z" />
        <Path d="M12,12h0A2.99994,2.99994,0,0,1,9,9H9a2.99994,2.99994,0,0,1,3-3h0a2.99994,2.99994,0,0,1,3,3h0A2.99994,2.99994,0,0,1,12,12Z" />
      </G>
    ),
    viewBox: DEF_VIEWBOX
  },
  Plus: {

  },
  Reload: {

  },
  Star: {

  },
  ThreeDots: {
    svg: (
      <G>
        <Circle cx="12" cy="12" r="2" />
        <Circle cx="5" cy="12" r="2" />
        <Circle cx="19" cy="12" r="2" />
      </G>
    ),
    viewBox: DEF_VIEWBOX
  },
  Trash: {

  },
  Unassign: {

  },
  Upload: {

  },
  Vote: {

  }
}
