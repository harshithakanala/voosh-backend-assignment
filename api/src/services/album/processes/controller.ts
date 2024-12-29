import { Request, Response, NextFunction } from 'express';
import { Data } from 'music-database';
import { Constants } from 'music-types';

export const getAlbums = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { limit = 5, offset = 0, artist_id, hidden } = req.query;

    if (hidden !== undefined && !['true', 'false'].includes(hidden as string)) {
      return res.status(400).json({
        status: 400,
        data: null,
        message: 'Bad request.',
        error: null,
      });
    }

    const user = req.user;

    if (!user || ![Constants.UserRole.Admin, Constants.UserRole.Editor].includes(user.role as (typeof Constants.UserRole.Editor) || typeof Constants.UserRole.Admin)) {
      return res.status(401).json({
        status: 401,
        data: null,
        message: 'Unauthorized Access',
        error: null,
      });
    }

    const filters: any = {};

    if (artist_id) {
      const artist = await Data.ArtistData.getArtistById(artist_id as string);

      if (!artist) {
        return res.status(404).json({
          status: 404,
          data: null,
          message: 'Artist not found.',
          error: null,
        });
      }
      filters.artistId = artist_id;
    }

    if (hidden !== undefined) {
      filters.hidden = hidden === 'true';
    }

    const result = await Data.AlbumData.getAlbums(filters, Number(limit), Number(offset));

    if (result.albums.length === 0) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: 'No albums found matching the criteria.',
        error: null,
      });
    }

    return res.status(200).json({
      status: 200,
      data: result.albums,
      message: 'Albums retrieved successfully.',
      error: null,
    });
  } catch (error) {
    next(error);

    return;
  }
};

export const getAlbumById = async (req: Request, res: Response, next: NextFunction) => {
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

    const album = await Data.AlbumData.getAlbumById(id);

    if (!album) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: 'Album not found.',
        error: null,
      });
    }

    return res.status(200).json({
      status: 200,
      data: album,
      message: 'Album retrieved successfully.',
      error: null,
    });
  } catch (error) {
    next(error);

    return;
  }
};

export const addAlbum = async (req: Request, res: Response, next: NextFunction) => {
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

    if (![Constants.UserRole.Admin].includes(user.role as typeof Constants.UserRole.Admin)) {
      return res.status(403).json({
        status: 403,
        data: null,
        message: 'Forbidden Access/Operation not allowed.',
        error: null,
      });
    }

    const { name, year, hidden, artistId } = req.body;

    if (!name || typeof year !== 'number' || typeof hidden !== 'boolean' || !artistId) {
      return res.status(400).json({
        status: 400,
        data: null,
        message: 'Bad Request.',
        error: null,
      });
    }

    const newAlbum = await Data.AlbumData.addAlbum(req.body);

    return res.status(201).json({
      status: 201,
      data: newAlbum,
      message: 'Album created successfully.',
      error: null,
    });
  } catch (error) {
    next(error);

    return;
  }
};

export const updateAlbum = async (req: Request, res: Response, next: NextFunction) => {
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
        message: 'Forbidden Access',
        error: null,
      });
    }

    const { name, year, hidden } = req.body;

    if (!Object.keys(req.body).length) {
      return res.status(400).json({
        status: 400,
        data: null,
        message: 'Bad Request.',
        error: null,
      });
    }

    if (typeof name !== 'string' || typeof year !== 'number' || typeof hidden !== 'boolean') {
      return res.status(400).json({
        status: 400,
        data: null,
        message: 'Bad Request.',
        error: null,
      });
    }

    const updatedAlbum = await Data.AlbumData.updateAlbum(id, req.body);

    if (!updatedAlbum) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: 'Album not found.',
        error: null,
      });
    }

    return res.status(204).send();
  } catch (error) {
    next(error);

    return;
  }
};

export const deleteAlbum = async (req: Request, res: Response, next: NextFunction) => {
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

    const deletedAlbum = await Data.AlbumData.deleteAlbum(id);

    if (!deletedAlbum) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: 'Album not found.',
        error: null,
      });
    }

    return res.status(200).json({
      status: 200,
      data: { album_id: deletedAlbum._id },
      message: `Album: ${deletedAlbum.name} deleted successfully.`,
      error: null,
    });
  } catch (error) {
    next(error);

    return;
  }
};
