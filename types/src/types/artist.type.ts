import { BaseType } from './base.type';

export type Artist = BaseType & {
  name: string;
  grammy: number; 
  hidden: boolean; };
