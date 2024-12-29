import { Request, Response, NextFunction } from 'express';
import { Data } from 'music-database';
import { Constants } from 'music-types';
import { handleBadRequest, handleUnauthorized, handleForbidden, handleNotFound, handleSuccess, handleCreated, handleNoContent } from '../../../utils/statusHandler';
import { handleError } from '../../../utils/errorHandler';

export const getTracks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { limit = '5', offset = '0', artist_id, album_id, hidden } = req.query;

    if (isNaN(Number(limit)) || Number(limit) <= 0) {
      return handleBadRequest(res, 'Bad Request.');
    }

    if (isNaN(Number(offset)) || Number(offset) < 0) {
      return handleBadRequest(res, 'Bad Request.');
    }

    if (hidden !== undefined && !['true', 'false'].includes(hidden as string)) {
      return handleBadRequest(res, 'Bad Request.');
    }

    const user = req.user;

    if (!user) {
      return handleUnauthorized(res, 'Unauthorized Access.');
    }

    if (![Constants.UserRole.Admin, Constants.UserRole.Editor].includes(user.role as (typeof Constants.UserRole.Editor) || typeof Constants.UserRole.Admin )) {
      return handleForbidden(res, 'Forbidden Access/Operation not allowed.');
    }

    if (artist_id) {
      const artistExists = await Data.ArtistData.getArtistById(artist_id as string);

      if (!artistExists) {
        return handleNotFound(res, 'Artist not found.');
      }
    }

    if (album_id) {
      const albumExists = await Data.AlbumData.getAlbumById(album_id as string);

      if (!albumExists) {
        return handleNotFound(res, 'Album not found.');
      }
    }

    const filters: any = {};
    if (artist_id) filters.artistId = artist_id;
    if (album_id) filters.albumId = album_id;
    if (hidden !== undefined) filters.hidden = hidden === 'true';

    const result = await Data.TrackData.getAllTracks(Number(limit), Number(offset), filters);

    if (result.length === 0) {
      return handleNotFound(res, 'No tracks found matching the criteria.');
    }

    return handleSuccess(res, result, 'Tracks retrieved successfully.');
  } catch (error) {
    return handleError(res, next, error);
  }
};

export const getTrackById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const user = req.user;

    if (!user) {
      return handleUnauthorized(res, 'Unauthorized Access');
    }

    if (![Constants.UserRole.Admin, Constants.UserRole.Editor].includes(user.role as (typeof Constants.UserRole.Editor) || typeof Constants.UserRole.Admin)) {
      return handleForbidden(res, 'Forbidden Access/Operation not allowed.');
    }

    const track = await Data.TrackData.getTrackById(id);

    if (!track) {
      return handleNotFound(res, 'Track not found.');
    }

    return handleSuccess(res, track, 'Track retrieved successfully.');
  } catch (error) {
    return handleError(res, next, error);
  }
};

export const addTrack = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { artist_id, album_id, name, duration, hidden = false } = req.body;
    const user = req.user;

    if (!user) {
      return handleUnauthorized(res, 'Unauthorized Access.');
    }

    if (![Constants.UserRole.Admin].includes(user.role as typeof Constants.UserRole.Admin)) {
      return handleForbidden(res, 'Forbidden Access/Operation not allowed.');
    }

    if (!artist_id || !album_id || !name || typeof duration !== 'number') {
      return handleBadRequest(res, 'Bad Request.');
    }

    const artistExists = await Data.ArtistData.getArtistById(artist_id);

    if (!artistExists) {
      return handleNotFound(res, 'Artist not found.');
    }

    const albumExists = await Data.AlbumData.getAlbumById(album_id);

    if (!albumExists) {
      return handleNotFound(res, 'Album not found.');
    }

    const newTrack = await Data.TrackData.addTrack({
      artistId: artist_id,
      albumId: album_id,
      name,
      duration,
      hidden,
    });

    const populatedTrack = await Data.TrackData.getTrackById(newTrack._id);

    if (!populatedTrack) {
      return handleError(res, next, new Error('Failed to populate track.'));
    }

    const response = {
      _id: populatedTrack._id,
      name: populatedTrack.name,
      duration: populatedTrack.duration,
      hidden: populatedTrack.hidden,
      artist_name: populatedTrack.Artist?.name,
      album_name: populatedTrack.Album?.name,
    };

    return handleCreated(res, response, 'Track created successfully.');
  } catch (error) {
    return handleError(res, next, error);
  }
};

export const updateTrack = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const user = req.user;
    const updateData = req.body;

    if (!user) {
      return handleUnauthorized(res, 'Unauthorized Access');
    }

    if (![Constants.UserRole.Admin, Constants.UserRole.Editor].includes(user.role as typeof Constants.UserRole.Editor || typeof Constants.UserRole.Admin)) {
      return handleForbidden(res, 'Forbidden Access/Operation not allowed.');
    }

    if (!Object.keys(updateData).length) {
      return handleBadRequest(res, 'Bad Request.');
    }

    const track = await Data.TrackData.getTrackById(id);

    if (!track) {
      return handleNotFound(res, 'Track not found.');
    }

    const updatedTrack = await Data.TrackData.updateTrack(id, updateData);

    if (!updatedTrack) {
      return handleError(res, next, new Error('Failed to update track.'));
    }

    const response = {
      _id: updatedTrack._id,
      name: updatedTrack.name,
      duration: updatedTrack.duration,
      hidden: updatedTrack.hidden,
      artist_name: updatedTrack.Artist?.name,
      album_name: updatedTrack.Album?.name,
    };

    return handleSuccess(res, response, 'Track updated successfully.');
  } catch (error) {
    return handleError(res, next, error);
  }
};

export const deleteTrack = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const user = req.user;

    if (!user) {
      return handleUnauthorized(res, 'Unauthorized Access');
    }

    if (![Constants.UserRole.Admin, Constants.UserRole.Editor].includes(user.role as typeof Constants.UserRole.Editor || typeof Constants.UserRole.Admin)) {
      return handleForbidden(res, 'Forbidden Access/Operation not allowed.');
    }

    const track = await Data.TrackData.getTrackById(id);

    if (!track) {
      return handleNotFound(res, 'Track not found.');
    }

    await Data.TrackData.deleteTrack(id);

    return handleSuccess(res, null, `Track: ${track.name} deleted successfully.`);
  } catch (error) {
    return handleError(res, next, error);
  }
};
