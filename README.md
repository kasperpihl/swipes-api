# swipes-api
The Swipes API consists of both a Public API and a background Worker

The task of the background worker is to handle everything that the client shouldn't wait for a response to happen.
This includes Integrations, Email sending and so forth.


Public API is in api folder, Background worker is in worker folder.
All shared files between them are in the common folder including:
Database connector
Model/Collections to create objects and queries
Utilities including logger
