# Welcome to the Swipes server
Few important things to know
- Endpoints gets automatically scanned and made available
We scan all files within the endpoints folder.
Endpoints export the endpointCreate() util. If they add .background() after the export they schedule a queue job to run in the background after the endpoint has returned.
Endpoints get automatically available as /v1/:file_name
billing.add.js > /v1/billing.add
Also queue jobs get automatically scanned, they are exporting the queueCreateJob util and should be named .queue.js in the end (to make it clear it's not publicly available)

# Installing Sharp on windows

Run the following as an administrator.

If you have problem with `npm install` and node_gyp because of sharp do:
```
npm uninstall windows-build-tools && npm install --global --production windows-build-tools
```

```
npm install --global --production windows-build-tools
```
