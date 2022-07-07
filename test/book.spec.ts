//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

import mongoose from "mongoose";

//Require the dev-dependencies
import { should as _should, use, request } from 'chai';
import chaiHttp from 'chai-http';
import server from '../src/server';
import { Book } from "../src/models/book";
let should = _should();


use(chaiHttp);
//Our parent block
describe('Books', () => {
  beforeEach((done) => { //Before each test we empty the database
    Book.remove({}, (err) => {
      done();
    });
  });
  /*
    * Test the /GET route
    */
  describe('/GET book', () => {
    it('it should GET all the books', (done) => {
      request(server)
        .get('/book')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(0);
          done();
        });
    });


  });

  /*
  * Test the /POST route
  */
  describe('/POST book', () => {
    it('it should not POST a book without pages field', (done) => {
      let book = {
        title: "The Lord of the Rings",
        author: "J.R.R. Tolkien",
        year: 1954
      }
      request(server)
        .post('/book')
        .send(book)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('errors');
          res.body.errors.should.have.property('pages');
          res.body.errors.pages.should.have.property('kind').eql('required');
          done();
        });
    });

  });

});