import React from 'react';
import { G, Path, Polygon, Circle, Rect } from 'react-native-svg';

const DEF_VIEWBOX = '0 0 24 24';

export default {
  ActivityCheckmark: {
    svg: <Polygon points="11.768,14.268,7.438,11.768,6.438,13.5,12.5,17,18,7.474,16.268,6.474,11.768,14.268" />,
    viewBox: DEF_VIEWBOX,
  },
  AddPerson: {

  },
  Archive: {
    svg: (
      <G>
        <Path d="M5,18H19V8H5Zm4-8h6v2H9Z" />
        <Rect x="4" y="5" width="16" height="2" />
      </G>
    ),
    viewBox: DEF_VIEWBOX,
  },
  ArrowLeftLine: {
    svg: <Polygon points="14.1,6.3 15.6,7.7 11.3,12 15.6,16.3 14.1,17.7 8.4,12" />,
    viewBox: DEF_VIEWBOX,
  },
  ArrowRightFull: {

  },
  ArrowRightLine: {

  },
  Assign: {

  },
  Breadcrumb: {
    svg: <Polygon points="10,9,10,15,14,12,10,9" />,
    viewBox: DEF_VIEWBOX,
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
    svg: <Polygon points="16.243,9.172,14.829,7.757,12,10.586,9.171,7.757,7.757,9.172,10.586,12,7.757,14.828,9.171,16.243,12,13.414,14.829,16.243,16.243,14.828,13.414,12,16.243,9.172" />,
    viewBox: DEF_VIEWBOX,
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
  File: {
    svg: (
      <G>
        <Rect x="11" y="10" width="2" height="5" />
        <Rect x="14" y="10" width="2" height="5" />
        <Rect x="8" y="13" width="2" height="2" />
        <Path d="M14.17163,5,18,8.82861V19H6V5h8.17163M15,3H4V21H20V8L15,3Z" />
      </G>
    ),
    viewBox: DEF_VIEWBOX,
  },
  Find: {
    svg: <Path d="M21,19.293l-4.1064-4.1065a7.01913,7.01913,0,1,0-1.4141,1.4141L19.586,20.707ZM6.293,11a5,5,0,1,1,5,5A5.0058,5.0058,0,0,1,6.293,11Z" />,
    viewBox: DEF_VIEWBOX,
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
    svg: (
      <G>
        <Rect x="11" y="6" width="2" height="12" />
        <Rect x="7.00095" y="8.99999" width="2" height="5.99999" />
        <Rect x="3.00191" y="10.99998" width="2" height="1.99999" />
        <Rect x="19.00191" y="10.99998" width="2" height="1.99999" />
        <Rect x="15.00095" y="8.99999" width="2" height="5.99999" />
      </G>
    ),
    viewBox: DEF_VIEWBOX,
  },
  GotUnassigned: {

  },
  Hashtag: {

  },
  Handoff: {
    svg: <Polygon points="12.281,7,11,8.358,13.495,11,7,11,7,13,13.492,13,11,15.643,12.281,17,17,11.998,12.281,7" />,
    viewBox: DEF_VIEWBOX,
  },
  Hyperlink: {
    svg: (
      <G>
        <Path d="M11,17H10A5,5,0,0,1,10,7h1V9H10a3,3,0,0,0,0,6h1Z" />
        <Path d="M14,17H13V15h1a3,3,0,0,0,0-6H13V7h1a5,5,0,0,1,0,10Z" />
        <Rect x="9" y="11" width="6" height="2" />
      </G>
    ),
    viewBox: DEF_VIEWBOX,
  },
  Iteration: {
    svg: <Path d="M12,4a8.00917,8.00917,0,0,0-8,8H1l4.04834,5L9,12H6a6.00664,6.00664,0,1,1,2.18262,4.62549L6.94385,18.19336A7.998,7.998,0,1,0,12,4Z" />,
    viewBox: DEF_VIEWBOX,
  },
  LogoLoader: {

  },
  Logout: {

  },
  Burger: {
    svg: (
      <G>
        <Rect x="6" y="8" width="12" height="2" />
        <Rect x="6" y="11" width="12" height="2" />
        <Rect x="6" y="14" width="12" height="2" />
      </G>
    ),
    viewBox: DEF_VIEWBOX,
  },
  Milestones: {

  },
  Minus: {

  },
  Note: {
    svg: (
      <G>
        <Rect x="7" y="7" width="10" height="2" />
        <Rect x="7" y="10" width="10" height="2" />
        <Path d="M4,3V21H20V3ZM18,19H6V5H18Z" />
        <Rect x="7" y="13" width="6" height="2" />
      </G>
    ),
    viewBox: DEF_VIEWBOX,
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
    viewBox: DEF_VIEWBOX,
  },
  Plus: {
    svg: <Polygon points="17,11,13,11,13,7,11,7,11,11,7,11,7,13,11,13,11,17,13,17,13,13,17,13,17,11" />,
    viewBox: DEF_VIEWBOX,
  },
  Reload: {

  },
  Star: {
    svg: <Polygon points="12,5,13.652,9.966,19,9.966,14.674,13.034,16.326,18,12,14.931,7.674,18,9.326,13.034,5,9.966,10.347,9.966,12,5" />,
    viewBox: DEF_VIEWBOX,
  },
  SwipesLogoText: {
    svg: (
      <G>
        <Path d="M87.169,64H16.25009L.00009,90H89.358c16.77686,0,30.91406-13.72852,30.63818-30.50391A29.99729,29.99729,0,0,0,103.41611,33.168,11.06262,11.06262,0,0,0,98.46884,32H33.169a3.11466,3.11466,0,0,1-3.165-2.83887A3.00043,3.00043,0,0,1,33.00009,26h70.75l16.25-26H30.64218C13.86533,0-.27286,13.729.004,30.50391A29.99671,29.99671,0,0,0,16.58408,56.832l.02588.0127A11.4377,11.4377,0,0,0,21.72617,58H87.00009a3.11341,3.11341,0,0,1,3.165,2.83984A2.99988,2.99988,0,0,1,87.169,64Z" />
      </G>
    ),
    viewBox: '0 0 120.00016 90',
  },
  ThreeDots: {
    svg: (
      <G>
        <Circle cx="12" cy="12" r="2" />
        <Circle cx="5" cy="12" r="2" />
        <Circle cx="19" cy="12" r="2" />
      </G>
    ),
    viewBox: DEF_VIEWBOX,
  },
  Trash: {

  },
  Unassign: {

  },
  Upload: {

  },
  Vote: {

  },
};
