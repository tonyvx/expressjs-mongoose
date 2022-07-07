import express from 'express';
import * as bookController from '../controllers/bookController';

export const booksRouter = express.Router();

booksRouter.route('/')
  .get(bookController.getBooks)
  .post(bookController.postBook);

booksRouter.route('/:id')
  .get(bookController.getBook)
  .delete(bookController.deleteBook)
  .put(bookController.updateBook);


