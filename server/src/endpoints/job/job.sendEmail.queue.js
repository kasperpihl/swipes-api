import queueCreateJob from 'src/utils/queue/queueCreateJob';

export default queueCreateJob(async (req, res, next) => {
  console.log('executing email job!', new Date().toISOString(), res.locals);
});
