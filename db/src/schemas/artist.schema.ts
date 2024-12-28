import { model, Schema } from 'mongoose';
import { Types } from '../types';
import { schemaOptions } from './schema-options';
import { randomUUID } from 'crypto';

const ArtistSchema = new Schema<Types.Artist>({
  _id: {
    type: String,
    default: () => randomUUID({ disableEntropyCache: true }),
  },
  name: {
    type: String,
    required: [true, 'Artist name is required'],
    maxlength: [100, 'Artist name cannot exceed 100 characters'],
  },
  grammy: {
    type: Boolean,
    required: true,
  },
  hidden: {
    type: Boolean,
    default: false,
  },
}, schemaOptions);

// create the model
const Artist = model<Types.Artist>('artist', ArtistSchema, 'artists');

export { Artist, ArtistSchema };
