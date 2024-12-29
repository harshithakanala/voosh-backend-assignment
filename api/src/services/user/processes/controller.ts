import { Request, Response, NextFunction } from 'express';
import { Constants } from 'music-types';
import { Data } from 'music-database';
import { handleBadRequest, handleUnauthorized, handleForbidden, handleNotFound, handleSuccess, handleCreated, handleNoContent, handleConflict } from '../../../utils/statusHandler';
import { handleError } from '../../../utils/errorHandler';

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { limit = 5, offset = 0, role } = req.query;

    if (role && ![Constants.UserRole.Editor, Constants.UserRole.Viewer].includes(role as (typeof Constants.UserRole.Editor) || typeof Constants.UserRole.Viewer)) {
      return handleBadRequest(res, 'Bad request.');
    }

    const user = req.user;

    if (!user || user.role !== Constants.UserRole.Admin) {
      return handleUnauthorized(res, 'Unauthorized Access');
    }

    const users = await Data.UserData.getUsers({
      limit: Number(limit),
      offset: Number(offset),
      role: role as string,
    });

    return handleSuccess(res, users, 'Users retrieved successfully.');
  } catch (error) {
    return handleError(res, next, error);
  }
};

export const addUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, role } = req.body;
    const user = req.user;

    if (!user || user.role !== Constants.UserRole.Admin) {
      return handleUnauthorized(res, 'Unauthorized Access');
    }

    if (req.user.role !== Constants.UserRole.Admin) {
      return handleForbidden(res, 'Forbidden Access/Operation not allowed.');
    }

    if (role !== Constants.UserRole.Editor && role !== Constants.UserRole.Viewer) {
      return handleBadRequest(res, 'Bad request.');
    }

    const existingUser = await Data.UserData.getUserByEmail(email);

    if (existingUser) {
      return handleConflict(res, 'Email already exists.');
    }

    await Data.UserData.createUser({ email, password, role });

    return handleCreated(res, null, 'User created successfully.');
  } catch (error) {
    return handleError(res, next, error);
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!req.user) {
      return handleUnauthorized(res, 'Unauthorized Access');
    }

    if (req.user.role !== Constants.UserRole.Admin) {
      return handleForbidden(res, 'Forbidden Access/Operation not allowed.');
    }

    if (!id) {
      return handleBadRequest(res, 'Bad Request');
    }

    const user = await Data.UserData.getUserById(id);

    if (!user) {
      return handleNotFound(res, 'User not found.');
    }

    await Data.UserData.deleteUserById(id);

    return handleSuccess(res, null, 'User deleted successfully.');
  } catch (error) {
    return handleError(res, next, error);
  }
};

export const updatePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { old_password, new_password } = req.body;
    const userId = req.user?._id;

    if (!userId || !old_password || !new_password) {
      return handleBadRequest(res, 'Bad request.');
    }

    const user = await Data.UserData.getUserById(userId);

    if (!user) {
      return handleNotFound(res, 'User not found.');
    }

    const isOldPasswordValid = await Data.UserData.comparePassword(old_password, user.password);

    if (!isOldPasswordValid) {
      return handleForbidden(res, 'Forbidden Access/Operation not allowed.');
    }

    await Data.UserData.updateUserPassword(userId, old_password, new_password);

    return handleNoContent(res);
  } catch (error) {
    return handleError(res, next, error);
  }
};
