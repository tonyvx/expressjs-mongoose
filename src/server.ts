import express from 'express';

import mongoose from 'mongoose';
import morgan from 'morgan'
import bodyParser from 'body-parser';
import { indexRouter } from './routes/indexRouter';
import { booksRouter } from './routes/booksRouter';
import config from 'config';

// let config = require('config'); //we load the db location from the JSON files
//db options
let options = {
  // server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }, 
  // replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } } 
};

//db connection      
let app = express();
let port = 8081;
console.log(config.get('DBHost'));
mongoose.connect(config.get('DBHost'), options);
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

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
app.use('/book', booksRouter);

app.listen(port);
console.log("Listening on port " + port);

export default app; // for testing