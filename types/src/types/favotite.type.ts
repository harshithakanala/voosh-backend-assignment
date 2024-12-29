import { BaseType } from './base.type';
import { CategoryType } from './constants';

export type CategoryType = keyof typeof CategoryType;

export type Favorite = BaseType & {
  userId: string; 
  itemId: string; 
  category: CategoryType;
}
