import { model, Schema } from 'mongoose';
import { Constants, Types } from 'music-types';
import { schemaOptions } from './schema-options';
import { randomUUID } from 'crypto';

const FavoriteSchema = new Schema<Types.Favorite>({
  _id: {
    type: String,
    default: () => randomUUID({ disableEntropyCache: true }),
  },
  userId: {
    type: String,
    required: [true, 'User ID is required'],
  },
  itemId: {
    type: String,
    required: [true, 'Item ID is required'],
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: Object.values(Constants.CategoryType),
      message: 'Invalid value for category type',
    },
  },
}, schemaOptions);

FavoriteSchema.index({ userId: 1, itemId: 1, category: 1 }, { unique: true });

FavoriteSchema.virtual('User', {
  ref: 'user',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
});

// create the model
const Favorite = model<Types.Favorite>('favorite', FavoriteSchema, 'favorites');

export { Favorite, FavoriteSchema };
