import { BaseType } from './base.type';
import { EntityType } from './constants';
import { User } from './user.type';

export type EntityType = keyof typeof EntityType;

export type Favorite = BaseType & {
  userId: string;
  entityId: string;
  entityType: EntityType;
  readonly User?: User;
};
