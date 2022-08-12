import { Request, Response } from 'express';
import { CallbackWithoutResult } from 'mongoose';
import { Book } from '../models/book';
import { BookDTO } from '../models/bookDTO';

/*
 * GET /book route to retrieve all the books.
 */
export const getBooks = (_req: Request, res: Response) => Book.find({}).exec(mongooseResponse(res, 200));

/*
 * POST /book to save a new book.
 */
export const postBook = (req: Request, res: Response) => new Book(req.body).save(mongooseResponse(res, 201));

/*
 * GET /book/:id route to retrieve a book given its id.
 */
export const getBook = (req: Request, res: Response) => Book.findById(req.params.id, mongooseResponse(res, 200));

/*
 * DELETE /book/:id to delete a book given its id.
 */
export const deleteBook = (req: Request, res: Response) =>
    Book.remove({ _id: req.params.id }, mongooseCallBack(res, "Deleted!!"));

/*
 * PUT /book/:id to updatea a book given its id
 */
export const updateBook = (req: Request, res: Response) =>
    Book.findById({ _id: req.params.id }, (err: any, book: BookDTO) => {
        if (err) {
            res.status(400).send(err);
        } else if (!book) {
            res.status(404).send("Book not found");
        } else {
            (new Book(Object.assign(book, req.body))).save(mongooseResponse(res, 200));
        }
    });


const mongooseCallBack = (res: Response, message: string): CallbackWithoutResult => (err: any) => {
    if (err) {
        res.status(500).send(err.message);
    } else {
        res.json({ message });
    }
};

const mongooseResponse = (res: Response, status: number) => <T>(err: any, books: T[] | T) => {
    if (err) {
        res.status(400).send(err.message);
    } else if (!books) {
        res.status(404).send("Not found");
    } else {
        //If no errors, send them back to the client
        res.status(status).json(books);
    }
}
