import express from 'express';
import * as bookController from '../controllers/bookController';

import { check, oneOf } from "express-validator";
import { validationMiddleware } from '../middleware/validateAndConvertDTO';
import { BookDTO } from '../models/bookDTO';

export const booksRouter = express.Router();

booksRouter.get("/", bookController.getBooks)

booksRouter.post("/"
  , oneOf([check('Content-Type', "Request Header: Content-Type: application/json expected!! ").equals("application/json")])
  , validationMiddleware(BookDTO)
  , bookController.postBook);

booksRouter.get('/:id', bookController.getBook)

booksRouter.delete('/:id', bookController.deleteBook)

booksRouter.put('/:id'
  , oneOf([check('Content-Type', "Request Header: Content-Type: application/json expected!! ").equals("application/json")])
  , validationMiddleware(BookDTO)
  , bookController.updateBook);


