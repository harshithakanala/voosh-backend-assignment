import { Request, Response, NextFunction } from 'express';
import { Data } from 'music-database';
import { Constants } from 'music-types';
import { handleBadRequest, handleUnauthorized, handleForbidden, handleNotFound, handleSuccess, handleCreated, handleNoContent } from '../../../utils/statusHandler';
import { handleError } from '../../../utils/errorHandler';

export const getArtists = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { limit = 5, offset = 0, grammy, hidden } = req.query;

    if (grammy !== undefined && isNaN(Number(grammy))) {
      return handleBadRequest(res, 'Bad request.');
    }

    if (hidden !== undefined && !['true', 'false'].includes(hidden as string)) {
      return handleBadRequest(res, 'Bad request.');
    }

    const user = req.user;

    if (!user || ![Constants.UserRole.Admin, Constants.UserRole.Editor].includes(user.role as (typeof Constants.UserRole.Editor) || typeof Constants.UserRole.Admin)) {
      return handleUnauthorized(res, 'Unauthorized Access');
    }

    const filters: any = {};
    if (grammy !== undefined) filters.grammy = Number(grammy);
    if (hidden !== undefined) filters.hidden = hidden === 'true';

    const result = await Data.ArtistData.getArtists(filters, Number(limit), Number(offset));

    return handleSuccess(res, result.artists, 'Artists retrieved successfully.');
  } catch (error) {
    return handleError(res, next, error);
  }
};

export const getArtistById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const user = req.user;

    if (!user) {
      return handleUnauthorized(res, 'Unauthorized Access');
    }

    if (![Constants.UserRole.Admin, Constants.UserRole.Editor].includes(user.role as (typeof Constants.UserRole.Editor) || typeof Constants.UserRole.Admin)) {
      return handleForbidden(res, 'Forbidden Access/Operation not allowed.');
    }

    const artist = await Data.ArtistData.getArtistById(id);

    if (!artist) {
      return handleNotFound(res, 'Artist not found.');
    }

    return handleSuccess(res, artist, 'Artist retrieved successfully.');
  } catch (error) {
    return handleError(res, next, error);
  }
};

export const addArtist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;

    if (!user) {
      return handleUnauthorized(res, 'Unauthorized Access');
    }

    if (![Constants.UserRole.Admin].includes(user.role as typeof Constants.UserRole.Admin)) {
      return handleForbidden(res, 'Forbidden Access/Operation not allowed.');
    }

    const { name, grammy, hidden } = req.body;

    if (!name || typeof grammy !== 'number' || typeof hidden !== 'boolean') {
      return handleBadRequest(res, 'Bad Request.');
    }

    const newArtist = await Data.ArtistData.addArtist(req.body);

    return handleCreated(res, newArtist, 'Artist created successfully.');
  } catch (error) {
    return handleError(res, next, error);
  }
};

export const updateArtist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const user = req.user;

    if (!user) {
      return handleUnauthorized(res, 'Unauthorized Access');
    }

    if (![Constants.UserRole.Admin, Constants.UserRole.Editor].includes(user.role as (typeof Constants.UserRole.Editor) || typeof Constants.UserRole.Admin)) {
      return handleForbidden(res, 'Forbidden Access');
    }

    const { name, grammy, hidden } = req.body;

    if (!Object.keys(req.body).length) {
      return handleBadRequest(res, 'Bad Request.');
    }

    if (name !== undefined && typeof name !== 'string' || grammy !== undefined && typeof grammy !== 'number' || hidden !== undefined && typeof hidden !== 'boolean') {
      return handleBadRequest(res, 'Bad Request.');
    }

    const updatedArtist = await Data.ArtistData.updateArtist(id, req.body);

    if (!updatedArtist) {
      return handleNotFound(res, 'Artist not found.');
    }

    return handleNoContent(res);
  } catch (error) {
    return handleError(res, next, error);
  }
};

export const deleteArtist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const user = req.user;

    if (!user) {
      return handleUnauthorized(res, 'Unauthorized Access');
    }

    if (![Constants.UserRole.Admin, Constants.UserRole.Editor].includes(user.role as (typeof Constants.UserRole.Editor) || typeof Constants.UserRole.Admin)) {
      return handleForbidden(res, 'Forbidden Access/Operation not allowed.');
    }

    const deletedArtist = await Data.ArtistData.deleteArtist(id);

    if (!deletedArtist) {
      return handleNotFound(res, 'Artist not found.');
    }

    return handleSuccess(res, { artist_id: deletedArtist._id }, `Artist: ${deletedArtist.name} deleted successfully.`);
  } catch (error) {
    return handleError(res, next, error);
  }
};
