import { Types } from 'music-types';
import { Models } from '../schemas';

const albumModel = Models.Album;

export const getAlbums = async (filters: any, limit: number, offset: number) => {
  const query: any = {};
  if (filters.artistId) query.artistId = filters.artistId;
  if (filters.hidden !== undefined) query.hidden = filters.hidden;

  const albums = await albumModel.find(query).limit(limit).skip(offset);
  const total = await albumModel.countDocuments(query);

  return { albums, total };
};

export const getAlbumById = async (albumId: string) => {
  return albumModel.findById(albumId);
};

export const addAlbum = async (albumData: Types.Album) => {
  const newAlbum = new albumModel(albumData);

  return newAlbum.save();
};

export const updateAlbum = async (albumId: string, updateData: Partial<Types.Album>) => {
  return albumModel.findByIdAndUpdate(albumId, updateData, { new: true });
};

export const deleteAlbum = async (albumId: string) => {
  return albumModel.findByIdAndDelete(albumId);
};
