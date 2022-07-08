import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import config from 'config';

//db options
export let options = {
  // server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }, 
  // replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } } 
};


export const getDBConnection = async () => {
  const dbUri: string = await getDBUri();
  console.log(dbUri);

  try {
    mongoose.connection
      .on('open', (err) => {
        console.info('Mongo DB Connection success!');
      }).on('close', (err) => {
        console.warn('Mongo DB Connection Closed!');
      })
      .on('error', (err) => console.error('\x1b[0;31m%s\x1b[0m', `MongoDB Connection Error: ${err.message}`));

    await mongoose.connect(dbUri, options);
  } catch (e) {
    throw new Error(`MongoDB Startup error ${e}`);
  }
};

const getDBUri = async () => {
  let dbUri: string = config.get('DBHost');

  if (process.env.NODE_ENV === 'test') {
    dbUri = (await MongoMemoryServer.create()).getUri();
  }
  return dbUri;
}

