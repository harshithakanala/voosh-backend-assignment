import { Models } from '../schemas';
import { Types } from 'music-types';
import bcrypt from 'bcryptjs';

const userModel = Models.User;

export const createUser = async (user: Types.User): Promise<Types.User> => {
  try {
    const newUser = await userModel.create(user);

    return newUser.toObject();
  } catch (error) {
    console.log(error);
    throw new Error('Error creating user');
  }
};

export const getUserByEmail = async (email: string): Promise<Types.User | null> => {
  return await userModel.findOne({ email });
};

export const getUserById = async (userId: string): Promise<Types.User | null> => {
  return await userModel.findById(userId);
};

export const deleteUserById = async (userId: string): Promise<void | null> => {
  return await userModel.findByIdAndDelete(userId);
};

export const updateUserPassword = async (userId: string, password: string): Promise<Types.User> => {
  const user = await userModel.findById(userId);
  if (!user) throw new Error('User not found');
  user.password = password;

  return await user.save();
};

export const countUsers = async (): Promise<number> => {
  return await userModel.countDocuments();
};

export const comparePassword = async (inputPassword: string, storedPassword: string): Promise<boolean> => {
  return bcrypt.compare(inputPassword, storedPassword);
};