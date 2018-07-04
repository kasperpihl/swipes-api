import config from 'config';
import cors from 'cors';

export default cors({
  origin: config.get('cors'),
  methods: 'HEAD, GET, POST',
  allowedHeader: 'Content-Type, Range, Accept, X-Requested-With, Session, Content-Length, X-Requested-With',
  exposedHeaders: 'Accept-Ranges, Content-Encoding, Content-Length, Content-Range',
});