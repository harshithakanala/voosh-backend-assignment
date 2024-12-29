import { Response } from 'express';

export const handleBadRequest = (res: Response, message: string) => {
  return res.status(400).json({
    status: 400,
    data: null,
    message,
    error: null,
  });
};

export const handleUnauthorized = (res: Response, message: string) => {
  return res.status(401).json({
    status: 401,
    data: null,
    message,
    error: null,
  });
};

export const handleForbidden = (res: Response, message: string) => {
  return res.status(403).json({
    status: 403,
    data: null,
    message,
    error: null,
  });
};

export const handleNotFound = (res: Response, message: string) => {
  return res.status(404).json({
    status: 404,
    data: null,
    message,
    error: null,
  });
};

export const handleConflict = (res: Response, message: string) => {
  return res.status(409).json({
    status: 409,
    data: null,
    message,
    error: null,
  });
};

export const handleSuccess = (res: Response, data: any, message: string) => {
  return res.status(200).json({
    status: 200,
    data,
    message,
    error: null,
  });
};

export const handleCreated = (res: Response, data: any, message: string) => {
  return res.status(201).json({
    status: 201,
    data,
    message,
    error: null,
  });
};

export const handleNoContent = (res: Response) => {
  return res.status(204).send();
};
