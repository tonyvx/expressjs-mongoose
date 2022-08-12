import express from 'express';

import bodyParser from 'body-parser';
import compression from 'compression';
import config from 'config';
import fs from 'fs';
import https from 'https';
import morgan from 'morgan';
import { getDBConnection } from './getDBConnection';
import { booksRouter } from './routes/booksRouter';
import { indexRouter } from './routes/indexRouter';
import helmet from 'helmet';

let app = express();

// Use gzip/deflate compression for responses
app.use(compression());

// Use Helmet to protect against well known vulnerabilities
app.use(helmet());

//db connection  
getDBConnection();

// console.error.bind(console,'\x1b[0;31m%s\x1b[0m', 'connection error:')

//don't show the log when it is test
if (config.util.getEnv('NODE_ENV') !== 'test') {
  //use morgan to log at command line
  app.use(morgan('combined')); //'combined' outputs the Apache style LOGs
}

//parse application/json and look for raw text    
// In order for the routes in our Express application to be able to handle POST requests with a JSON body                                    
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', indexRouter);
app.use('/book', booksRouter);

const port = process.env.PORT || 8443;
https.createServer(getSSLCertCredentials(), app).listen(port);

console.log("Listening on port " + port);

export default app; // for testing

//TODO
function getSSLCertCredentials() {
  let key = fs.readFileSync('.ssh/key.pem', 'utf8');
  let cert = fs.readFileSync('.ssh/cert.pem', 'utf8');

  return { key, cert, passphrase: "123456" };
}

