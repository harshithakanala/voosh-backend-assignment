import { NextFunction, Request, Response } from 'express';
import { Constants, Types } from 'music-types';
import { Data } from 'music-database';

export const addFavoriteController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        status: 401,
        data: null,
        message: 'Unauthorized Access',
        error: null,
      });
    }

    if (![Constants.UserRole.Admin, Constants.UserRole.Editor, Constants.UserRole.Viewer].includes(user.role)) {
      return res.status(403).json({
        status: 403,
        data: null,
        message: 'Forbidden Access/Operation not allowed.',
        error: null,
      });
    }

    const { category, item_id } = req.body;

    if (!category || !item_id) {
      return res.status(400).json({
        status: 400,
        data: null,
        message: 'Bad Request.',
        error: null,
      });
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
      return res.status(400).json({
        status: 400,
        data: null,
        message: 'Bad Request.',
        error: null,
      });
    }

    if (!itemExists) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: `${category} not found.`,
        error: null,
      });
    }

    const favoriteData: Types.Favorite = {
      ...req.body,
      userId: user._id,
    };

    const favorite = await Data.FavoriteData.addFavorite(favoriteData);

    return res.status(201).json({
      status: 201,
      data: favorite,
      message: 'Favorite added successfully',
      error: null,
    });
  } catch (error) {
    next(error);

    return;
  }
};

export const getFavorites = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category } = req.params;
    const { limit = '5', offset = '0' } = req.query;
    const validCategories = Object.values(Constants.CategoryType);

    if (!category || !validCategories.includes(category as (typeof Constants.CategoryType.Album) || typeof Constants.CategoryType.Artist || typeof Constants.CategoryType.Track)) {
      return res.status(400).json({
        status: 400,
        data: null,
        message: 'Bad Request.',
        error: null,
      });
    }

    if (isNaN(Number(limit)) || Number(limit) <= 0) {
      return res.status(400).json({
        status: 400,
        data: null,
        message: 'Bad Request.',
        error: null,
      });
    }

    if (isNaN(Number(offset)) || Number(offset) < 0) {
      return res.status(400).json({
        status: 400,
        data: null,
        message: 'Bad Request.',
        error: null,
      });
    }

    const user = req.user;

    if (!user) {
      return res.status(401).json({
        status: 401,
        data: null,
        message: 'Unauthorized Access.',
        error: null,
      });
    }

    if (![Constants.UserRole.Admin, Constants.UserRole.Editor, Constants.UserRole.Viewer].includes(user.role)) {
      return res.status(403).json({
        status: 403,
        data: null,
        message: 'Forbidden Access/Operation not allowed.',
        error: null,
      });
    }

    const result = await Data.FavoriteData.getFavoritesByCategory(user._id!, category, Number(limit), Number(offset));

    if (result.length === 0) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: `No ${category} favorites found.`,
        error: null,
      });
    }

    return res.status(200).json({
      status: 200,
      data: result.map((favorite: any) => ({
        favorite_id: favorite._id,
        category: favorite.category,
        item_id: favorite.itemId,
        name: favorite.name,
        created_at: favorite.createdAt,
      })),
      message: 'Favorites retrieved successfully.',
      error: null,
    });
  } catch (error) {
    next(error);

    return;
  }
};

export const removeFavorite = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        status: 401,
        data: null,
        message: 'Unauthorized Access',
        error: null,
      });
    }

    if (![Constants.UserRole.Admin, Constants.UserRole.Editor, Constants.UserRole.Viewer].includes(user.role)) {
      return res.status(403).json({
        status: 403,
        data: null,
        message: 'Forbidden Access/Operation not allowed.',
        error: null,
      });
    }

    const deletedFavourite = await Data.FavoriteData.removeFavoriteById(id);

    if (!deletedFavourite) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: 'Favourite not found.',
        error: null,
      });
    }

    return res.status(200).json({
      status: 200,
      data: null,
      message: 'Favorite removed successfully.',
      error: null,
    });
  } catch (error) {
    next(error);

    return;
  }
};
