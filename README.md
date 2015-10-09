# swipes-api
The Swipes API consists of both a Public API and a background Worker

The task of the background worker is to handle everything that the client shouldn't wait for a response to happen.
This includes Integrations, Email sending and so forth.


Public API is in api folder, Background worker is in worker folder.
All shared files between them are in the common folder including:
Database connector
Model/Collections to create objects and queries
Utilities including logger

### Required software to run the server
1. node 0.12.x
2. postgres >= 9.4

If you want to use pgadmin3 you need >= 1.20 (because it supports postgres >= 9.4)
If you want to start clean project make a test account on slack.
