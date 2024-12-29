import { Request, Response, NextFunction } from 'express';
import { Data } from 'music-database';
import { Constants } from 'music-types';

export const getArtists = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { limit = 5, offset = 0, grammy, hidden } = req.query;

    if (grammy !== undefined && isNaN(Number(grammy))) {
      return res.status(400).json({
        status: 400,
        data: null,
        message: 'Bad request.',
        error: null,
      });
    }

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
    if (grammy !== undefined) filters.grammy = Number(grammy);
    if (hidden !== undefined) filters.hidden = hidden === 'true';

    const result = await Data.ArtistData.getArtists(filters, Number(limit), Number(offset));

    return res.status(200).json({
      status: 200,
      data: result.artists,
      message: 'Artists retrieved successfully.',
      error: null,
    });
  } catch (error) {
    next(error);

    return;
  }
};

export const getArtistById = async (req: Request, res: Response, next: NextFunction) => {
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

    const artist = await Data.ArtistData.getArtistById(id);

    if (!artist) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: 'Artist not found.',
        error: null,
      });
    }

    return res.status(200).json({
      status: 200,
      data: artist,
      message: 'Artist retrieved successfully.',
      error: null,
    });
  } catch (error) {
    next(error);

    return;
  }
};

export const addArtist = async (req: Request, res: Response, next: NextFunction) => {
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

    const { name, grammy, hidden } = req.body;

    if (!name || typeof grammy !== 'number' || typeof hidden !== 'boolean') {
      return res.status(400).json({
        status: 400,
        data: null,
        message: 'Bad Request.',
        error: null,
      });
    }

    const newArtist = await Data.ArtistData.addArtist(req.body);

    return res.status(201).json({
      status: 201,
      data: newArtist,
      message: 'Artist created successfully.',
      error: null,
    });
  } catch (error) {
    next(error);

    return;
  }
};

export const updateArtist = async (req: Request, res: Response, next: NextFunction) => {
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

    const { name, grammy, hidden } = req.body;

    if (!Object.keys(req.body).length) {
      return res.status(400).json({
        status: 400,
        data: null,
        message: 'Bad Request.',
        error: null,
      });
    }

    if (typeof name !== 'string' || grammy !== undefined && typeof grammy !== 'number' || hidden !== undefined && typeof hidden !== 'boolean') {
      return res.status(400).json({
        status: 400,
        data: null,
        message: 'Bad Request.',
        error: null,
      });
    }

    const updatedArtist = await Data.ArtistData.updateArtist(id, req.body);

    if (!updatedArtist) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: 'Artist not found.',
        error: null,
      });
    }

    return res.status(204).send();
  } catch (error) {
    next(error);

    return;
  }
};

export const deleteArtist = async (req: Request, res: Response, next: NextFunction) => {
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

    const deletedArtist = await Data.ArtistData.deleteArtist(id);

    if (!deletedArtist) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: 'Artist not found.',
        error: null,
      });
    }

    return res.status(200).json({
      status: 200,
      data: { artist_id: deletedArtist._id },
      message: `Artist: ${deletedArtist.name} deleted successfully.`,
      error: null,
    });
  } catch (error) {
    next(error);

    return;
  }
};
