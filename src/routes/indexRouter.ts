import express from 'express';
export const indexRouter = express.Router();

/* GET home page. */
indexRouter.get('/', (_req, res, _next) => res.send('Welcome to bookstore'));
// indexRouter.get('/', (_req, res, _next) => res.render('index', { title: 'Welcome to bookstore' }));
