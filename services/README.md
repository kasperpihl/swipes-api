A service is the way to interact with data from outside Swipes

It will provide an easy way to connect apps with peoples existing data

A service should have a name


# User stories
As an admin I can activate the Service for others to use it
As a user, I can authorize each service 
As an admin I can set settings for the Service to be applied accross the whole organisation
As a user, I can set settings for the Service to be applied only for my usage of the Service
As a developer I can access data in 

# API
services.activate
services.deactivate
services.list
services.authorize



swipes.service("jira").findAll(options, callback)