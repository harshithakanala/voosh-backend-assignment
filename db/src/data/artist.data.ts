import { Types } from 'music-types';
import { Models } from '../schemas';

const artistModel = Models.Artist;

export const getArtists = async (filters: any, limit: number, offset: number) => {
  const query: any = {};
  if (filters.grammy !== undefined) query.grammy = filters.grammy;
  if (filters.hidden !== undefined) query.hidden = filters.hidden;

  const artists = await artistModel.find(query).limit(limit).skip(offset);
  const total = await artistModel.countDocuments(query);

  return { artists, total };
};

export const getArtistById = async (artistId: string) => {
  return artistModel.findById(artistId);
};

export const addArtist = async (artistData: Types.Artist) => {
  const newArtist = new artistModel(artistData);

  return newArtist.save();
};

export const updateArtist = async (artistId: string, updateData: Partial<Types.Artist>) => {
  return artistModel.findByIdAndUpdate(artistId, updateData, { new: true });
};

export const deleteArtist = async (artistId: string) => {
  return artistModel.findByIdAndDelete(artistId);
};
