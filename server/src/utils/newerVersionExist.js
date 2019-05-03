export default (client, server) => {
  server = '' + (server || 0);
  client = '' + (client || 0);

  let newerVersion = false;
  if (server.indexOf('.') > -1) {
    const serverVals = server.split('.');
    const clientVals = client.split('.');
    let isBigger = false;
    serverVals.forEach((serverVal, i) => {
      const clientVal = parseInt(clientVals[i] || '0', 10);
      serverVal = parseInt(serverVal || '0', 10);
      if (clientVal > serverVal) {
        isBigger = true;
      }
      if (serverVal > clientVal && !isBigger) {
        newerVersion = true;
      }
    });
  } else {
    newerVersion = parseInt(server, 10) > parseInt(client, 10);
  }

  return newerVersion;
};
