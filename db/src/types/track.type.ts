import { Album } from './album.type';
import { Artist } from './artist.type';
import { BaseType } from './base.type';

export type Track = BaseType & {
  name: string;
  duration: number;
  hidden: boolean;
  albumId: string;
  artistId: string;
  readonly Album?: Album;
  readonly Artist?: Artist;
};
