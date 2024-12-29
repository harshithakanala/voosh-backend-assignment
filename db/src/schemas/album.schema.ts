import { model, Schema } from 'mongoose';
import { Types } from 'music-types';
import { schemaOptions } from './schema-options';
import { randomUUID } from 'crypto';

const AlbumSchema = new Schema<Types.Album>({
  _id: {
    type: String,
    default: () => randomUUID({ disableEntropyCache: true }),
  },
  name: {
    type: String,
    required: [true, 'Album name is required'],
    maxlength: [200, 'Album name cannot exceed 200 characters'],
  },
  year: {
    type: Number,
    required: true,
  },
  hidden: {
    type: Boolean,
    default: false,
  },
  artistId: {
    type: String,
    required: [true, 'Artist ID is required'],
  },
}, schemaOptions);

AlbumSchema.virtual('Artist', {
  ref: 'artist',
  localField: 'artistId',
  foreignField: '_id',
  justOne: true,
});

// create the model
const Album = model<Types.Album>('album', AlbumSchema, 'albums');

export { Album, AlbumSchema };
