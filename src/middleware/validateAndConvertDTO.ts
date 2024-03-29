import { plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { NextFunction, Request, Response } from "express";
import { ValidationError as ExpressValidationError, validationResult } from "express-validator";
import util from 'util';
const debuglog = util.debuglog('validationMiddleware');

type ValidationShortError = {
    [root: string]: string[]
}
const addAllConstraints = (errors1: ValidationError[] | undefined, errorTexts1: ValidationShortError = {}, root: string = "root") => {
    if (errors1) {
        errorTexts1[root] = errors1
            .filter((errorItem: ValidationError) => !!errorItem.constraints)
            .reduce((l: string[], errorItem: ValidationError) => {
                if (errorItem.constraints) {
                    return Object.values(errorItem.constraints).concat(l);
                }
                return l;
            }
                , []);
        errors1.filter((errorItem: ValidationError) => !!errorItem.children && errorItem.children.length > 0)
            .forEach((errorItem: ValidationError) => addAllConstraints(errorItem.children, errorTexts1, errorItem.property));
    }
}
export const validationMiddleware = (dtoClass: any) => {


    return function (req: Request, res: Response, next: NextFunction) {

        try {
            validationResult(req).throw();
            debuglog("express-validator - Success!!!");
            const output: any = plainToInstance(dtoClass, req.body);

            validate(output, { skipMissingProperties: true }).then((errors: ValidationError[] | undefined) => {
                // errors is an array of validation errors

                if (errors && errors.length > 0) {
                    debuglog("class-validator - Failure !!!\n%j\n", errors);
                    let errorTexts: ValidationShortError = {};
                    addAllConstraints(errors, errorTexts, "errors");
                    res.status(400).send(errorTexts);
                } else {
                    res.locals.input = output;
                    debuglog("class-validator: Success!!!");
                    next();
                }
            });
        } catch (err1) {
            // Oh noes. This user doesn't have enough skills for this...
            debuglog("express-validator - Failure !!!\n%j\n", err1);
            const err = (err1 as { errors: ExpressValidationError[] }).errors?.map(e => e.nestedErrors?.map((e1: any) => e1.msg + " Received : " + e1.value)).flat();
            res.status(400).json({ errors: err });
        }

    };
};