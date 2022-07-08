import { plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { NextFunction, Request, Response } from "express";

type ValidationShortError = {
    [root: string]: string[]
}
const addAllConstraints = (errors1: ValidationError[]|undefined, errorTexts1: ValidationShortError = {}, root: string = "root") => {
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
export const validationMw = (dtoClass: any) => {
    
    
    return function (req: Request, res: Response, next: NextFunction) {
        console.log("validating request");
        const output: any = plainToInstance(dtoClass, req.body);

        validate(output, { skipMissingProperties: true }).then((errors: ValidationError[] | undefined) => {
            // errors is an array of validation errors

            if (errors && errors.length > 0) {
                let errorTexts: ValidationShortError = {};
                addAllConstraints(errors, errorTexts, "errors");
                res.status(400).send(errorTexts);
            } else {
                res.locals.input = output;
                next();
            }
        });
    };
};