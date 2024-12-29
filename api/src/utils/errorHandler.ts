import { NextFunction, Response } from 'express';

export const handleError = (res: Response, next: NextFunction, error: any) => {
  next(error);

  return res.status(500).json({
    status: 500,
    data: null,
    message: 'Internal Server Error',
    error: error instanceof Error ? error.message : 'Unknown error',
  });
};
