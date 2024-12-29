import { model, Schema } from 'mongoose';
import { Constants, Types } from 'music-types';
import { randomUUID } from 'crypto';
import { schemaOptions } from './schema-options';
import bcrypt from 'bcryptjs';

const UserSchema = new Schema<Types.User>({
  _id: {
    type: String,
    default: () => randomUUID({ disableEntropyCache: true }),
  },
  email: {
    type: String,
    required: [true, 'email is required'],
    match: [Constants.EMAIL_VALIDATION_PATTERN, 'Please enter a valid email '],
    maxlength: [75, 'email cannot exceed 75 characters'],
  },
  password: {
    type: String,
    required: [true, 'password is required'],
    minlength: [8, 'password must be atleast of 8 characters'],
  },
  role: {
    type: String,
    required: true,
    enum: {
      values: [...Object.values(Constants.UserRole)],
      message: 'Invalid value for user role name',
    },
  },
}, schemaOptions);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// create unique index
UserSchema.index({ email: 1 }, { unique: true, name: 'unique_user_email' });

// create the model
const User = model<Types.User>('user', UserSchema, 'users');

export { User, UserSchema };
