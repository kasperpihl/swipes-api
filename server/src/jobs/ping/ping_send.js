import queueCreateJob from 'src/utils/queue/queueCreateJob';

const testing = () => new Promise((resolve, reject) => {
  throw Error('hi');
})

export default queueCreateJob({
  eventName: 'ping_send',
}, async (req, res, next) => {
  await testing();
  res.status(200).json({ ok: true, res: {} });
});