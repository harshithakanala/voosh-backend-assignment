import mongoose from 'mongoose';
import { Models } from './schemas';
import { Constants } from 'music-types';

import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../../environment/.env') });

const userModel = Models.User;

export const connectToDatabase = async (): Promise<void> => {
  try {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
      throw new Error('MongoDB URI is not defined in the .env file');
    }

    await mongoose.connect(uri);

    console.log('Connected to MongoDB successfully');
    const userCount = await userModel.countDocuments();

    if (userCount === 0) {
      const defaultAdmin = new userModel({
        email: 'admin@gmail.com',
        password: 'admin@123',
        role: Constants.UserRole.Admin,
      });

      await defaultAdmin.save();
      console.log('First Admin user created');
    }
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};
