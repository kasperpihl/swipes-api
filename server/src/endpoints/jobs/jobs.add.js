import queueCreateJob from 'src/utils/queue/queueCreateJob';

export default queueCreateJob(async (req, res, next) => {
  console.log('running at schedule', new Date().toISOString());
});
