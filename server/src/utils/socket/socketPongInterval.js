export default wss => {
  const noop = () => {};
  setInterval(() => {
    wss.clients.forEach(socket => {
      if (socket.isAlive === false) return socket.terminate();

      socket.isAlive = false;
      socket.ping(noop);
      return undefined;
    });
  }, 30000);
};
