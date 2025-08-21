import { Hono } from 'hono'
import user from './user.js'
import upload from './upload.js'
import bodyParser from '../middlewares/body-parser.js'
import translate from '../middlewares/translate.js'

const app = new Hono()
  .route('/user', user)
  .route('/upload', upload)

export default new Hono()
  .use(bodyParser())
  .use(translate())
  .route('/', app)