import express from 'express';
import * as bookController from '../controllers/bookController';

import { validationMw } from '../middleware/validateAndConvertDTO';
import { BookDTO } from '../models/bookDTO';

export const booksRouter = express.Router();

booksRouter.get("/", bookController.getBooks)
booksRouter.post("/", validationMw(BookDTO), bookController.postBook);

booksRouter.get('/:id', bookController.getBook)
booksRouter.delete('/:id', bookController.deleteBook)

booksRouter.put('/:id', validationMw(BookDTO), bookController.updateBook);


