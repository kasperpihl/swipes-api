var React = require('react');
var Reflux = require('reflux');
var MainStore = require('../stores/MainStore');
var MainActions = require('../actions/MainActions');

var SideMenu = React.createClass({
  mixins: [MainStore.connect()],
  renderSection: function() {
    var workspaces = this.state.workspaces;
    var sections = [];

    workspaces.forEach(function(workspace) {
      sections.push(<SideMenuSection key={workspace.id} workspace={workspace} />)
    })

    return sections;
  },
  render: function() {
    var workspaces = this.state.workspaces;
    var sidebarClass = 'sidebar';

    if (this.state.sideMenu) {
      sidebarClass += ' open'
    }

    return (
      <div className={sidebarClass}>
        {this.renderSection()}
      </div>
    )
  }
});

var SideMenuSection = React.createClass({
  renderProjects: function() {
    var self = this;
    var workspace = this.props.workspace;
    var projects = workspace.projects;
    var projectList = [];

    if (projects) {
      projects.forEach(function(project) {
        projectList.push(<SideMenuProject key={project.id} project={project} onClick={self.onClick}/>)
      });
    }

    return projectList;
  },
  onClick: function(project) {
    var workspace = this.props.workspace;

    var newSettings = {
			workspaceId: workspace.id,
			projectId: project.id,
			projectType: null
		};

    if (workspace.id && project.id) {
			if (workspace.id === project.id) {
				newSettings.projectType = 'mytasks'
			}

      MainActions.updateSettings(newSettings, true);
		  MainActions.toggleSideMenu();
		}

    swipes.navigation.setTitle(project.name);
  },
  render: function () {
    var workspace = this.props.workspace;

    return (
      <div className="sidebar--section">
        <h6>{workspace.name}</h6>
        <div clasName="sidebar--section__projects">
          {this.renderProjects()}
        </div>
      </div>
    )
  }
});

var SideMenuProject = React.createClass({
  onClick: function() {
    this.props.onClick(this.props.project);
  },
  render: function () {
    var project = this.props.project;
    var projectId = project.id;
    var projectClass = 'project';

    if (MainStore.get('settings')) {
      if (projectId === MainStore.get('settings').projectId) {
        projectClass += ' active';
      }
    }

    return (
      <div className={projectClass} onClick={this.onClick}>{project.name}</div>
    )
  }
})

module.exports = SideMenu;
