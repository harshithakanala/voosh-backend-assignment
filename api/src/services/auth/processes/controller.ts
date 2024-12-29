import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Data } from 'music-database';
import { Constants } from 'music-types';
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export const signupUser = async (req: Request, res: Response): Promise<Response> => {
  const { email, password } = req.body;

  if (!email || !password) {
    const missingField = !email ? 'email' : 'password';

    return res.status(400).json({
      status: 400,
      data: null,
      message: `Bad Request, Reason:Missing Field ${missingField}`,
      error: null,
    });
  }

  try {
    const existingUser = await Data.UserData.getUserByEmail(email);

    if (existingUser) {
      return res.status(409).json({
        status: 409,
        data: null,
        message: 'Email already exists.',
        error: null,
      });
    }

    const role = (await Data.UserData.countUsers()) === 0 ? Constants.UserRole.Admin : Constants.UserRole.Viewer;
    const user = await Data.UserData.createUser({ email, password, role });
    console.log(user);

    return res.status(201).json({
      status: 201,
      data: null,
      message: 'User created successfully.',
      error: null,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      data: null,
      message: 'Internal Server Error: Unable to register user.',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<Response> => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      status: 400,
      data: null,
      message: 'Bad Request, Reason: Missing email or password',
      error: null,
    });
  }

  try {
    const user = await Data.UserData.getUserByEmail(email);
    console.log('User:', user);

    if (!user) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: 'User not found.',
        error: null,
      });
    }

    const isPasswordValid = await bcrypt.compare(password.trim(), user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        status: 401,
        data: null,
        message: 'Invalid password.',
        error: null,
      });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

    return res.status(200).json({
      status: 200,
      data: { token },
      message: 'Login successful.',
      error: null,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      data: null,
      message: 'Internal Server Error',
      error: error instanceof Error ? error.message : null,
    });
  }
};

export const logoutUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(400).json({
        status: 400,
        data: null,
        message: 'Bad Request.',
        error: null,
      });
    }

    try {
      await jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(400).json({
        status: 400,
        data: null,
        message: 'Bad Request.',
        error: null,
      });
    }

    return res.status(200).json({
      status: 200,
      data: null,
      message: 'User logged out successfully.',
      error: null,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      data: null,
      message: 'Internal Server Error.',
      error: error instanceof Error ? error.message : null,
    });
  }
};