import { Request, Response, NextFunction } from 'express';
import { Data } from 'music-database';
import { Constants } from 'music-types';
import { handleBadRequest, handleUnauthorized, handleForbidden, handleNotFound, handleSuccess, handleCreated, handleNoContent } from '../../../utils/statusHandler';
import { handleError } from '../../../utils/errorHandler';

export const getAlbums = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { limit = 5, offset = 0, artist_id, hidden } = req.query;

    if (hidden !== undefined && !['true', 'false'].includes(hidden as string)) {
      return handleBadRequest(res, 'Bad request.');
    }

    const user = req.user;

    if (!user || ![Constants.UserRole.Admin, Constants.UserRole.Editor].includes(user.role as (typeof Constants.UserRole.Editor) || typeof Constants.UserRole.Admin)) {
      return handleUnauthorized(res, 'Unauthorized Access');
    }

    const filters: any = {};

    if (artist_id) {
      const artist = await Data.ArtistData.getArtistById(artist_id as string);

      if (!artist) {
        return handleNotFound(res, 'Artist not found.');
      }
      filters.artistId = artist_id;
    }

    if (hidden !== undefined) {
      filters.hidden = hidden === 'true';
    }

    const result = await Data.AlbumData.getAlbums(filters, Number(limit), Number(offset));

    if (result.albums.length === 0) {
      return handleNotFound(res, 'No albums found matching the criteria.');
    }

    return handleSuccess(res, result.albums, 'Albums retrieved successfully.');
  } catch (error) {
    return handleError(res, next, error);
  }
};

export const getAlbumById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const user = req.user;

    if (!user) {
      return handleUnauthorized(res, 'Unauthorized Access');
    }

    if (![Constants.UserRole.Admin, Constants.UserRole.Editor].includes(user.role as (typeof Constants.UserRole.Editor) || typeof Constants.UserRole.Admin)) {
      return handleForbidden(res, 'Forbidden Access/Operation not allowed.');
    }

    const album = await Data.AlbumData.getAlbumById(id);

    if (!album) {
      return handleNotFound(res, 'Album not found.');
    }

    return handleSuccess(res, album, 'Album retrieved successfully.');
  } catch (error) {
    return handleError(res, next, error);
  }
};

export const addAlbum = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;

    if (!user) {
      return handleUnauthorized(res, 'Unauthorized Access');
    }

    if (![Constants.UserRole.Admin].includes(user.role as typeof Constants.UserRole.Admin)) {
      return handleForbidden(res, 'Forbidden Access/Operation not allowed.');
    }

    const { name, year, hidden, artistId } = req.body;

    if (!name || typeof year !== 'number' || typeof hidden !== 'boolean' || !artistId) {
      return handleBadRequest(res, 'Bad Request.');
    }

    const newAlbum = await Data.AlbumData.addAlbum(req.body);

    return handleCreated(res, newAlbum, 'Album created successfully.');
  } catch (error) {
    return handleError(res, next, error);
  }
};

export const updateAlbum = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const user = req.user;

    if (!user) {
      return handleUnauthorized(res, 'Unauthorized Access');
    }

    if (![Constants.UserRole.Admin, Constants.UserRole.Editor].includes(user.role as (typeof Constants.UserRole.Editor) || typeof Constants.UserRole.Admin)) {
      return handleForbidden(res, 'Forbidden Access');
    }

    const { name, year, hidden } = req.body;

    if (!Object.keys(req.body).length) {
      return handleBadRequest(res, 'Bad Request.');
    }

    if (name !== undefined && typeof name !== 'string' || year !== undefined && typeof year !== 'number' || hidden !== undefined && typeof hidden !== 'boolean') {
      return handleBadRequest(res, 'Bad Request.');
    }

    const updatedAlbum = await Data.AlbumData.updateAlbum(id, req.body);

    if (!updatedAlbum) {
      return handleNotFound(res, 'Album not found.');
    }

    return handleNoContent(res);
  } catch (error) {
    return handleError(res, next, error);
  }
};

export const deleteAlbum = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const user = req.user;

    if (!user) {
      return handleUnauthorized(res, 'Unauthorized Access');
    }

    if (![Constants.UserRole.Admin, Constants.UserRole.Editor].includes(user.role as (typeof Constants.UserRole.Editor) || typeof Constants.UserRole.Admin)) {
      return handleForbidden(res, 'Forbidden Access/Operation not allowed.');
    }

    const deletedAlbum = await Data.AlbumData.deleteAlbum(id);

    if (!deletedAlbum) {
      return handleNotFound(res, 'Album not found.');
    }

    return handleSuccess(res, { album_id: deletedAlbum._id }, `Album: ${deletedAlbum.name} deleted successfully.`);
  } catch (error) {
    return handleError(res, next, error);
  }
};
