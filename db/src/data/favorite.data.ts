import { Types } from 'music-types';
import { Models } from '../schemas';

const favoriteModel = Models.Favorite;

export const getFavoritesByCategory = async (userId: string, category: string, limit: number, offset: number) => {
  try {
    return await favoriteModel
      .find({ userId: userId, category })
      .skip(offset)
      .limit(limit)
      .exec();
  } catch (error) {
    throw new Error(`Error retrieving favorites: ${error.message}`);
  }
};

export const addFavorite = async (favoriteData: Types.Favorite) => {
  const favorite = new favoriteModel(favoriteData);

  return favorite.save();
};

export const removeFavoriteById = async (favoriteId: string) => {
  return favoriteModel.findByIdAndDelete(favoriteId).exec();
};
