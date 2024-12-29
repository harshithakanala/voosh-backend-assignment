import { Artist } from './artist.type';
import { BaseType } from './base.type';

export type Album = BaseType & {
  name: string;
  year: number; 
  hidden: boolean; 
  artistId: string;
  readonly Artist?: Artist;
};
