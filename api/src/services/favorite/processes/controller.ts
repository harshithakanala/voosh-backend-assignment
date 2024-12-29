import { NextFunction, Request, Response } from 'express';
import { Constants, Types } from 'music-types';
import { Data } from 'music-database';
import { handleBadRequest, handleUnauthorized, handleForbidden, handleNotFound, handleSuccess, handleCreated, handleConflict } from '../../../utils/statusHandler';
import { handleError } from '../../../utils/errorHandler';

export const addFavoriteController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;

    if (!user) {
      return handleUnauthorized(res, 'Unauthorized Access');
    }

    if (![Constants.UserRole.Admin, Constants.UserRole.Editor, Constants.UserRole.Viewer].includes(user.role)) {
      return handleForbidden(res, 'Forbidden Access/Operation not allowed.');
    }

    const { category, item_id } = req.body;

    if (!category || !item_id) {
      return handleBadRequest(res, 'Bad Request.');
    }

    let itemExists = false;

    if (category === Constants.CategoryType.Artist) {
      const artist = await Data.ArtistData.getArtistById(item_id);
      itemExists = artist !== null;
    } else if (category === Constants.CategoryType.Album) {
      const album = await Data.AlbumData.getAlbumById(item_id);
      itemExists = album !== null;
    } else if (category === Constants.CategoryType.Track) {
      const track = await Data.TrackData.getTrackById(item_id);
      itemExists = track !== null;
    } else {
      return handleBadRequest(res, 'Bad Request.');
    }

    if (!itemExists) {
      return handleNotFound(res, `${category} not found.`);
    }

    if (!user._id) {
      return handleBadRequest(res, 'User ID is missing.');
    }

    const favoriteData: Types.Favorite = {
      userId: user._id,
      itemId: item_id,
      category,
    };

    try {
      const favorite = await Data.FavoriteData.addFavorite(favoriteData);

      return handleCreated(res, favorite, 'Favorite added successfully');
    } catch (error) {
      if (error.code === 11000) {
        return handleConflict(res, 'Favorite already exists.');
      }
      throw error;
    }
  } catch (error) {
    return handleError(res, next, error);
  }
};

export const getFavorites = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category } = req.params;
    const { limit = '5', offset = '0' } = req.query;
    const validCategories = Object.values(Constants.CategoryType);

    if (!category || !validCategories.includes(category as (typeof Constants.CategoryType.Album) || typeof Constants.CategoryType.Artist || typeof Constants.CategoryType.Track)) {
      return handleBadRequest(res, 'Bad Request.');
    }

    if (isNaN(Number(limit)) || Number(limit) <= 0) {
      return handleBadRequest(res, 'Bad Request.');
    }

    if (isNaN(Number(offset)) || Number(offset) < 0) {
      return handleBadRequest(res, 'Bad Request.');
    }

    const user = req.user;

    if (!user) {
      return handleUnauthorized(res, 'Unauthorized Access.');
    }

    if (![Constants.UserRole.Admin, Constants.UserRole.Editor, Constants.UserRole.Viewer].includes(user.role)) {
      return handleForbidden(res, 'Forbidden Access/Operation not allowed.');
    }

    const result = await Data.FavoriteData.getFavoritesByCategory(user._id!, category, Number(limit), Number(offset));

    if (result.length === 0) {
      return handleNotFound(res, `No ${category} favorites found.`);
    }

    return handleSuccess(res, result.map((favorite: any) => ({
      favorite_id: favorite._id,
      category: favorite.category,
      item_id: favorite.itemId,
      name: favorite.name,
      created_at: favorite.createdAt,
    })), 'Favorites retrieved successfully.');
  } catch (error) {
    return handleError(res, next, error);
  }
};

export const removeFavorite = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const user = req.user;

    if (!user) {
      return handleUnauthorized(res, 'Unauthorized Access');
    }

    if (![Constants.UserRole.Admin, Constants.UserRole.Editor, Constants.UserRole.Viewer].includes(user.role)) {
      return handleForbidden(res, 'Forbidden Access/Operation not allowed.');
    }

    const deletedFavorite = await Data.FavoriteData.removeFavoriteById(id);

    if (!deletedFavorite) {
      return handleNotFound(res, 'Favorite not found.');
    }

    return handleSuccess(res, null, 'Favorite removed successfully.');
  } catch (error) {
    return handleError(res, next, error);
  }
};
