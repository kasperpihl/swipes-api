import { fromJS } from 'immutable';

/*
Syncing strategy:

v1: No conflict resolution
# On add task
Client: Send socket event with task details

# On complete/indent
Client: Send socket event with full new order, complete and indention arrays.
Server: Override database and send an event with updated project_row
Client: Always override with events from server

# On task title edit
Client: Send socket event with new title
Server: Override database and send an event with updated project_task row
Client: Always override with events from server
*/

export default {
  order: fromJS([
    { id: 'AFIAS', indent: 0, expanded: false, hasChildren: true },
    { id: 'nwOVm', indent: 1, hasChildren: true, expanded: false },
    { id: 'XLw6J', indent: 2, hasChildren: false, expanded: false },
    { id: 'OHEQ3', indent: 2, hasChildren: false, expanded: false },
    { id: 'eD26P', indent: 1, hasChildren: true, expanded: false },
    { id: 'di4BT', indent: 2, hasChildren: false, expanded: false },
    { id: '5NCnN', indent: 2, hasChildren: false, expanded: false },
    { id: 'sn4dX', indent: 2, hasChildren: false, expanded: false },
    { id: 'NFUif', indent: 1, hasChildren: true, expanded: false },
    { id: 'OVdNU', indent: 2, hasChildren: false, expanded: false },
    { id: 'E7Asr', indent: 2, hasChildren: false, expanded: false },
    { id: 'rHXxI', indent: 2, hasChildren: true, expanded: false },
    { id: 'XRSkG', indent: 3, hasChildren: false, expanded: false },
    { id: 'kJggu', indent: 3, hasChildren: false, expanded: false },
    { id: 'i05iF', indent: 3, hasChildren: false, expanded: false },
    { id: '3HGkS', indent: 3, hasChildren: false, expanded: false },
    { id: 'YTUoy', indent: 3, hasChildren: false, expanded: false },
    { id: 'Q7H4p', indent: 2, hasChildren: false, expanded: false },
    { id: '3iCnk', indent: 2, hasChildren: false, expanded: false },
    { id: 'w0HYe', indent: 2, hasChildren: false, expanded: false },
    { id: 'J2LxI', indent: 1, hasChildren: false, expanded: false },
    { id: 'AjG6I', indent: 1, hasChildren: true, expanded: false },
    { id: 'oZHfa', indent: 2, hasChildren: false, expanded: false },
    { id: 'psPt7', indent: 2, hasChildren: false, expanded: false },
    { id: 'DanXR', indent: 0, hasChildren: true, expanded: false },
    { id: 'ZuiX8', indent: 1, hasChildren: true, expanded: false },
    { id: '7gSef', indent: 2, hasChildren: false, expanded: false },
    { id: 'YTDiU', indent: 2, hasChildren: false, expanded: false },
    { id: 'GH823', indent: 2, hasChildren: false, expanded: false },
    { id: 'hRBY7', indent: 2, hasChildren: false, expanded: false },
    { id: 'ZwbkX', indent: 2, hasChildren: false, expanded: false },
    { id: 'X7Bgz', indent: 1, hasChildren: false, expanded: false },
    { id: 'ISv0q', indent: 0, hasChildren: false, expanded: false },
    { id: 'ufqrB', indent: 0, hasChildren: false, expanded: false },
    { id: 'a3dFK', indent: 0, hasChildren: false, expanded: false },
    { id: 'ECJyz', indent: 0, hasChildren: false, expanded: false },
    { id: 'EreuC', indent: 0, hasChildren: false, expanded: false },
  ]),
  itemsById: fromJS({
    di4BT: { id: 'di4BT', title: 'Update Electron', type: 'task' },
    YTUoy: { id: 'YTUoy', title: 'Upload to Youtube', type: 'task' },
    OVdNU: { id: 'OVdNU', title: 'Add new release', type: 'task' },
    '7gSef': { id: '7gSef', title: 'Concept', type: 'task' },
    EreuC: { id: 'EreuC', title: 'Product Hunt campaign', type: 'task' },
    '3iCnk': { id: '3iCnk', title: 'Release notes', type: 'task' },
    '5NCnN': { id: '5NCnN', title: 'Update Download guide', type: 'task' },
    i05iF: { id: 'i05iF', title: 'Screen recording', type: 'task' },
    DanXR: { id: 'DanXR', title: 'Newsletter', type: 'task' },
    eD26P: { id: 'eD26P', title: 'Desktop', type: 'task' },
    sn4dX: { id: 'sn4dX', title: 'Update Onboarding flow', type: 'task' },
    ECJyz: { id: 'ECJyz', title: 'Website update', type: 'task' },
    ISv0q: { id: 'ISv0q', title: 'In-app update', type: 'task' },
    OHEQ3: { id: 'OHEQ3', title: 'Screen size optimizations', type: 'task' },
    E7Asr: { id: 'E7Asr', title: 'Update app description', type: 'task' },
    ZuiX8: { id: 'ZuiX8', title: 'Workspace users', type: 'task' },
    psPt7: { id: 'psPt7', title: 'Update Privacy Policy', type: 'task' },
    ufqrB: { id: 'ufqrB', title: 'Media Outreach', type: 'task' },
    AjG6I: { id: 'AjG6I', title: 'Policies', type: 'task' },
    ZwbkX: { id: 'ZwbkX', title: 'Measure engagement', type: 'task' },
    rHXxI: { id: 'rHXxI', title: 'Record new video', type: 'task' },
    J2LxI: { id: 'J2LxI', title: 'Play Store', type: 'task' },
    YTDiU: { id: 'YTDiU', title: 'Visuals', type: 'task' },
    XRSkG: { id: 'XRSkG', title: 'Concept', type: 'task' },
    X7Bgz: { id: 'X7Bgz', title: 'Swipes Personal users', type: 'task' },
    hRBY7: { id: 'hRBY7', title: 'Send out', type: 'task' },
    kJggu: { id: 'kJggu', title: 'Script', type: 'task' },
    AFIAS: { id: 'AFIAS', title: 'Apps Update', type: 'task' },
    XLw6J: {
      id: 'XLw6J',
      title: 'Testing Browser compatability',
      type: 'task',
    },
    a3dFK: { id: 'a3dFK', title: 'Blog post', type: 'task' },
    oZHfa: { id: 'oZHfa', title: 'Update T&C', type: 'task' },
    GH823: { id: 'GH823', title: 'Set up draft in Mailchimp', type: 'task' },
    '3HGkS': { id: '3HGkS', title: 'Post-production', type: 'task' },
    NFUif: { id: 'NFUif', title: 'App Store', type: 'task' },
    w0HYe: { id: 'w0HYe', title: 'Send for approval', type: 'task' },
    nwOVm: { id: 'nwOVm', title: 'Web app', type: 'task' },
    Q7H4p: { id: 'Q7H4p', title: 'Add new screenshots', type: 'task' },
  }),
};
