import { Request, Response, NextFunction } from 'express';
import { Constants } from 'music-types';
import { Data } from 'music-database';

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { limit = 5, offset = 0, role } = req.query;

    if (role && ![Constants.UserRole.Editor, Constants.UserRole.Viewer].includes(role as (typeof Constants.UserRole.Editor) || typeof Constants.UserRole.Viewer)) {
      return res.status(400).json({
        status: 400,
        data: null,
        message: 'Bad request.',
        error: null,
      });
    }

    const user = req.user;

    if (!user || user.role !== Constants.UserRole.Admin) {
      return res.status(401).json({
        status: 401,
        data: null,
        message: 'Unauthorized Access',
        error: null,
      });
    }

    const users = await Data.UserData.getUsers({
      limit: Number(limit),
      offset: Number(offset),
      role: role as string,
    });

    return res.status(200).json({
      status: 200,
      data: users,
      message: 'Users retrieved successfully.',
      error: null,
    });
  } catch (error) {
    next(error);

    return;
  }
};

export const addUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, role } = req.body;
    const user = req.user;

    if (!user || user.role !== Constants.UserRole.Admin) {
      return res.status(401).json({
        status: 401,
        data: null,
        message: 'Unauthorized Access',
        error: null,
      });
    }

    if (req.user.role !== Constants.UserRole.Admin) {
      return res.status(403).json({
        status: 403,
        data: null,
        message: 'Forbidden Access/Operation not allowed.',
        error: null,
      });
    }

    if (role !== Constants.UserRole.Editor && role !== Constants.UserRole.Viewer) {
      return res.status(400).json({
        status: 400,
        data: null,
        message: 'Bad request.',
        error: null,
      });
    }

    const existingUser = await Data.UserData.getUserByEmail(email);

    if (existingUser) {
      return res.status(409).json({
        status: 409,
        data: null,
        message: 'Email already exists.',
        error: null,
      });
    }

    await Data.UserData.createUser({ email, password, role });

    return res.status(201).json({
      status: 201,
      data: null,
      message: 'User created successfully.',
      error: null,
    });
  } catch (error) {
    next(error);

    return;
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_id } = req.params;

    if (!req.user || req.user.role !== Constants.UserRole.Admin) {
      return res.status(401).json({
        status: 401,
        data: null,
        message: 'Unauthorized Access',
        error: null,
      });
    }

    if (req.user.role !== Constants.UserRole.Admin) {
      return res.status(403).json({
        status: 403,
        data: null,
        message: 'Forbidden Access/Operation not allowed.',
        error: null,
      });
    }

    if (!user_id) {
      return res.status(400).json({
        status: 400,
        data: null,
        message: 'Bad Request',
        error: null,
      });
    }

    const user = await Data.UserData.getUserById(user_id);

    if (!user) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: 'User not found.',
        error: null,
      });
    }

    await Data.UserData.deleteUserById(user_id);

    return res.status(200).json({
      status: 200,
      data: null,
      message: 'User deleted successfully.',
      error: null,
    });
  } catch (error) {
    next(error);

    return;
  }
};

export const updatePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { old_password, new_password } = req.body;
    const userId = req.user?._id;

    if (!userId || !old_password || !new_password) {
      return res.status(400).json({
        status: 400,
        data: null,
        message: 'Bad request.',
        error: null,
      });
    }

    const user = await Data.UserData.getUserById(userId);

    if (!user) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: 'User not found.',
        error: null,
      });
    }

    const isOldPasswordValid = await Data.UserData.comparePassword(old_password, user.password);

    if (!isOldPasswordValid) {
      return res.status(403).json({
        status: 403,
        data: null,
        message: 'Forbidden Access/Operation not allowed.',
        error: null,
      });
    }

    await Data.UserData.updateUserPassword(userId, old_password, new_password);

    return res.status(204).send();
  } catch (error) {
    next(error);

    return;
  }
};
