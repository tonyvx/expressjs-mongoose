import express from 'express';

import bodyParser from 'body-parser';
import config from 'config';
import morgan from 'morgan';
import { getDBConnection } from './getDBConnection';
import { booksRouter } from './routes/booksRouter';
import { indexRouter } from './routes/indexRouter';
import { validationMw } from './middleware/validateAndConvertDTO';
import { BookDTO } from './models/bookDTO';

const middleware = (req: express.Request, _res: express.Response, next: express.NextFunction) => {
  console.log('Request URL:', req.originalUrl);
  next();
}

//db connection      
let app = express();
getDBConnection();

// console.error.bind(console,'\x1b[0;31m%s\x1b[0m', 'connection error:')

//don't show the log when it is test
if (config.util.getEnv('NODE_ENV') !== 'test') {
  //use morgan to log at command line
  app.use(morgan('combined')); //'combined' outputs the Apache style LOGs
}

//parse application/json and look for raw text                                        
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/json' }));

app.use('/', indexRouter);
app.use('/book',  booksRouter);

const port = process.env.PORT||8081;
app.listen(port);

console.log("Listening on port " + port);

export default app; // for testing


