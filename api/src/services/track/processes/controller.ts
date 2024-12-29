import { Request, Response, NextFunction } from 'express';
import { Data } from 'music-database';
import { Constants } from 'music-types';

export const getTracks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { limit = '5', offset = '0', artist_id, album_id, hidden } = req.query;

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

    if (hidden !== undefined && !['true', 'false'].includes(hidden as string)) {
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

    if (![Constants.UserRole.Admin, Constants.UserRole.Editor].includes(user.role as (typeof Constants.UserRole.Editor) || typeof Constants.UserRole.Admin )) {
      return res.status(403).json({
        status: 403,
        data: null,
        message: 'Forbidden Access/Operation not allowed.',
        error: null,
      });
    }

    if (artist_id) {
      const artistExists = await Data.ArtistData.getArtistById(artist_id as string);

      if (!artistExists) {
        return res.status(404).json({
          status: 404,
          data: null,
          message: 'Artist not found.',
          error: null,
        });
      }
    }

    if (album_id) {
      const albumExists = await Data.AlbumData.getAlbumById(album_id as string);

      if (!albumExists) {
        return res.status(404).json({
          status: 404,
          data: null,
          message: 'Album not found.',
          error: null,
        });
      }
    }

    const filters: any = {};
    if (artist_id) filters.artistId = artist_id;
    if (album_id) filters.albumId = album_id;
    if (hidden !== undefined) filters.hidden = hidden === 'true';

    const result = await Data.TrackData.getAllTracks(Number(limit), Number(offset), filters);

    if (result.length === 0) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: 'No tracks found matching the criteria.',
        error: null,
      });
    }

    return res.status(200).json({
      status: 200,
      data: result,
      message: 'Tracks retrieved successfully.',
      error: null,
    });
  } catch (error) {
    next(error);

    return;
  }
};

export const getTrackById = async (req: Request, res: Response, next: NextFunction) => {
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

    if (![Constants.UserRole.Admin, Constants.UserRole.Editor].includes(user.role as (typeof Constants.UserRole.Editor) || typeof Constants.UserRole.Admin)) {
      return res.status(403).json({
        status: 403,
        data: null,
        message: 'Forbidden Access/Operation not allowed.',
        error: null,
      });
    }

    const track = await Data.TrackData.getTrackById(id);

    if (!track) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: 'Track not found.',
        error: null,
      });
    }

    return res.status(200).json({
      status: 200,
      data: track,
      message: 'Track retrieved successfully.',
      error: null,
    });
  } catch (error) {
    next(error);

    return;
  }
};

export const addTrack = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { artist_id, album_id, name, duration, hidden = false } = req.body;
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        status: 401,
        data: null,
        message: 'Unauthorized Access.',
        error: null,
      });
    }

    if (![Constants.UserRole.Admin].includes(user.role as typeof Constants.UserRole.Admin)) {
      return res.status(403).json({
        status: 403,
        data: null,
        message: 'Forbidden Access/Operation not allowed.',
        error: null,
      });
    }

    if (!artist_id || !album_id || !name || typeof duration !== 'number') {
      return res.status(400).json({
        status: 400,
        data: null,
        message: 'Bad Request.',
        error: null,
      });
    }

    const artistExists = await Data.ArtistData.getArtistById(artist_id);

    if (!artistExists) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: 'Artist not found.',
        error: null,
      });
    }

    const albumExists = await Data.AlbumData.getAlbumById(album_id);

    if (!albumExists) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: 'Album not found.',
        error: null,
      });
    }

    const newTrack = await Data.TrackData.addTrack({
      artistId: artist_id,
      albumId: album_id,
      name,
      duration,
      hidden,
    });

    return res.status(201).json({
      status: 201,
      data: newTrack,
      message: 'Track created successfully.',
      error: null,
    });
  } catch (error) {
    next(error);

    return;
  }
};

export const updateTrack = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const user = req.user;
    const updateData = req.body;

    if (!user) {
      return res.status(401).json({
        status: 401,
        data: null,
        message: 'Unauthorized Access',
        error: null,
      });
    }

    if (![Constants.UserRole.Admin, Constants.UserRole.Editor].includes(user.role as typeof Constants.UserRole.Editor || typeof Constants.UserRole.Admin)) {
      return res.status(403).json({
        status: 403,
        data: null,
        message: 'Forbidden Access/Operation not allowed.',
        error: null,
      });
    }

    if (!Object.keys(updateData).length) {
      return res.status(400).json({
        status: 400,
        data: null,
        message: 'Bad Request.',
        error: null,
      });
    }

    const track = await Data.TrackData.getTrackById(id);

    if (!track) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: 'Track not found.',
        error: null,
      });
    }

    await Data.TrackData.updateTrack(id, updateData);

    return res.status(204).send();
  } catch (error) {
    next(error);

    return;
  }
};

export const deleteTrack = async (req: Request, res: Response, next: NextFunction) => {
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

    if (![Constants.UserRole.Admin, Constants.UserRole.Editor].includes(user.role as typeof Constants.UserRole.Editor || typeof Constants.UserRole.Admin)) {
      return res.status(403).json({
        status: 403,
        data: null,
        message: 'Forbidden Access/Operation not allowed.',
        error: null,
      });
    }

    const track = await Data.TrackData.getTrackById(id);

    if (!track) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: 'Track not found.',
        error: null,
      });
    }

    await Data.TrackData.deleteTrack(id);

    return res.status(200).json({
      status: 200,
      data: null,
      message: `Track: ${track.name} deleted successfully.`,
      error: null,
    });
  } catch (error) {
    next(error);

    return;
  }
};
