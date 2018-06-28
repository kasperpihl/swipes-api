export default ({ notAuthed }) => {
  notAuthed.all('/ping.send',
    (req, res, next) => {
      console.log('hello');
      res.send('hi');
    }
  )
}
