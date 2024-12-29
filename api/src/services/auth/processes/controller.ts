import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Data } from 'music-database';
import { Constants } from 'music-types';
import { handleBadRequest, handleUnauthorized, handleNotFound, handleSuccess, handleCreated } from '../../../utils/statusHandler';
import { handleError } from '../../../utils/errorHandler';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export const signupUser = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
  const { email, password } = req.body;

  if (!email || !password) {
    const missingField = !email ? 'email' : 'password';

    return handleBadRequest(res, `Bad Request, Reason: Missing Field ${missingField}`);
  }

  try {
    const existingUser = await Data.UserData.getUserByEmail(email);

    if (existingUser) {
      return handleBadRequest(res, 'Email already exists.');
    }

    const role = (await Data.UserData.countUsers()) === 0 ? Constants.UserRole.Admin : Constants.UserRole.Viewer;
    const user = await Data.UserData.createUser({ email, password, role });

    return handleCreated(res, null, 'User created successfully.');
  } catch (error) {
    return handleError(res, next, error);
  }
};

export const loginUser = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
  const { email, password } = req.body;

  if (!email || !password) {
    return handleBadRequest(res, 'Bad Request, Reason: Missing email or password');
  }

  try {
    const user = await Data.UserData.getUserByEmail(email);

    if (!user) {
      return handleNotFound(res, 'User not found.');
    }

    const isPasswordValid = await bcrypt.compare(password.trim(), user.password);

    if (!isPasswordValid) {
      return handleUnauthorized(res, 'Invalid password.');
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '12h' });

    return handleSuccess(res, { token }, 'Login successful.');
  } catch (error) {
    return handleError(res, next, error);
  }
};

export const logoutUser = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return handleBadRequest(res, 'Bad Request.');
    }

    try {
      await jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return handleBadRequest(res, 'Bad Request.');
    }

    return handleSuccess(res, null, 'User logged out successfully.');
  } catch (error) {
    return handleError(res, next, error);
  }
};