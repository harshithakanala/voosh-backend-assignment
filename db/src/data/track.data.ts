import { Types } from 'music-types';
import { Models } from '../schemas';

const trackModel = Models.Track;

export const getAllTracks = async (
  limit: number = 5,
  offset: number = 0,
  filters: { artistId?: string; albumId?: string; hidden?: boolean } = {},
) => {
  return await trackModel
    .find(filters)
    .skip(offset)
    .limit(limit)
    .populate('Artist')
    .populate('Album');
};

export const getTrackById = async (trackId: string) => {
  return trackModel.findById(trackId).populate('Artist').populate('Album').exec();
};

export const addTrack = async (trackData: Types.Track) => {
  const newTrack = new trackModel(trackData);

  return newTrack.save();
};

export const updateTrack = async (trackId: string, updateData: Partial<Types.Track>) => {
  return trackModel.findByIdAndUpdate(trackId, updateData, { new: true });
};

export const deleteTrack = async (trackId: string) => {
  return trackModel.findByIdAndDelete(trackId);
};
