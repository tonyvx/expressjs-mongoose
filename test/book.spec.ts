//During the test the env variable is set to test
process.env.NODE_ENV = 'test';
import mocha, { after } from 'mocha';
//Require the dev-dependencies
import { request, should as _should, use } from 'chai';
import chaiHttp from 'chai-http';
import { Book } from "../src/models/book";
import server from '../src/server';
let should = _should();

use(chaiHttp);
//Our parent block
describe('Books', () => {
  beforeEach(async () => { //Before each test we empty the database
    await Book.remove({});
  });

  after(() => {
    console.log("All Tests completed");
  });
  /*
    * Test the /GET route
    */
  describe('/GET book', () => {
    it('it should GET all the books', async () => {
      const res = await request(server)
        .get('/book')

      res.should.have.status(200);
      res.body.should.be.a('array');
      res.body.length.should.be.eql(0);
    });
  });

  /*
  * Test the /POST route
  */
  describe('/POST book', () => {
    it('it should not POST a book without pages field', async () => {
      let book = {
        title: "The Lord of the Rings",
        author: "J.R.R. Tolkien",
        year: 1954
      }
      const res = await request(server)
        .post('/book')
        .send(book)

      res.should.have.status(400);
      res.body.should.be.a('object');
      res.body.should.have.property('errors');
      res.body.errors.should.have.length('1');
      res.body.errors[0].should.eql('pages should not be null or undefined');
    });
  });
});