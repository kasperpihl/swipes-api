const svg = (name) => require('./svgs/' + name + '.svg')
const png = (name) => require('./pngs/' + name + '.png')

export const PlusIcon = svg('sw-plus-icon')
export const FindIcon = svg('sw-find-icon')
export const EmptyWorkspace = svg('emptystate-workspace')
export const WorkspaceIcon = svg('workspace-icon')
export const SlackOnline = svg('slack-online')
export const SlackOffline = svg('slack-offline')

export const SlackIcon = svg('logo-slack')
export const SwipesIcon = png('swipes-logo')
