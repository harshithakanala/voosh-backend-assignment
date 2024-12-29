import { model, Schema } from 'mongoose';
import { Types } from 'music-types';
import { schemaOptions } from './schema-options';
import { randomUUID } from 'crypto';

const TrackSchema = new Schema<Types.Track>({
  _id: {
    type: String,
    default: () => randomUUID({ disableEntropyCache: true }),
  },
  name: {
    type: String,
    required: [true, 'Track name is required'],
    maxlength: [200, 'Track name cannot exceed 200 characters'],
  },
  duration: {
    type: Number,
    required: true,
  },
  hidden: {
    type: Boolean,
    default: false,
  },
  albumId: {
    type: String,
    required: [true, 'Album ID is required'],
  },
  artistId: {
    type: String,
    required: [true, 'Artist ID is required'],
  },
}, schemaOptions);

TrackSchema.virtual('Artist', {
  ref: 'artist',
  localField: 'artistId',
  foreignField: '_id',
  justOne: true,
});

TrackSchema.virtual('Album', {
  ref: 'album',
  localField: 'albumId',
  foreignField: '_id',
  justOne: true,
});

// create the model
const Track = model<Types.Track>('track', TrackSchema, 'tracks');

export { Track, TrackSchema };
