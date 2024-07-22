import { Request, Response } from "express";
import morgan, { StreamOptions } from "morgan";

const stream: StreamOptions = {
  write: (message) => console.log(message.trim()),
};

// Skip logging for certain routes or conditions (optional)
const skip = (req: Request, res: Response): boolean => {
  return res.statusCode < 400;
};

morgan.token("type", (req: Request) => req.headers["content-type"] || "");

const logginMiddleware = morgan(
  ":method :url :status :res[content-length] - :response-time ms :type",
  { stream, skip }
);

export default logginMiddleware;
