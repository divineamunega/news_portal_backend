import { Request, Response, NextFunction, RequestHandler } from "express";

// Define a type for asynchronous middleware functions
type AsyncRequestHandler = (
	req: Request,
	res: Response,
	next: NextFunction
) => Promise<any>;

/**
 * AsyncErrorHandler is a higher-order function that wraps asynchronous middleware functions
 * to catch any errors and pass them to the next error-handling middleware.
 *
 * @param fn - An asynchronous middleware function
 * @returns A new middleware function that handles errors
 */
const AsyncErrorHandler = (fn: AsyncRequestHandler): RequestHandler => {
	return (req: Request, res: Response, next: NextFunction) => {
		fn(req, res, next).catch(next); // Simplified error handling
	};
};

export default AsyncErrorHandler;
