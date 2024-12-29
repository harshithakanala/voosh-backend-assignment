import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Data } from 'music-database';
import { Types } from 'music-types';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

declare module 'express-serve-static-core' {
  interface Request {
    user: Types.User
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      status: 401,
      data: null,
      message: 'Unauthorized: Token not provided.',
      error: null,
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const user = await Data.UserData.getUserById(decoded.userId);

    if (!user) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: 'User not found.',
        error: null,
      });
    }
    req.user = user;
    next();

    return;
  } catch (error) {
    res.status(401).json({
      status: 401,
      data: null,
      message: 'Unauthorized Access',
      error: null,
    });

    return;
  }
};

export const authorize = (roles: string[]) => (req: Request, res: Response, next: NextFunction) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({
      status: 403,
      data: null,
      message: 'Forbidden: Access is denied.',
      error: null,
    });
  }
  next();

  return;
};
