import { BaseType } from './base.type';
import { EntityType } from './constants';

export type EntityType = keyof typeof EntityType;

export type Favorite = BaseType & {
  userId: string; 
  entityId: string; 
  entityType: EntityType;
}
