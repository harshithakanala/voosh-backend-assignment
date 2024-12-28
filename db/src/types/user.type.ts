import { BaseType } from './base.type';
import { UserRole } from './constants';

export type UserRole = keyof typeof UserRole;

export type User = BaseType & {
  email: string;
  password: string; 
  role: UserRole;
};
