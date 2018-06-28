export default ({ authed }) => {
  authed.all('/ping.markAsSeen',
    (req, res, next) => {
      console.log('marking');
      next();
    }
  )
}