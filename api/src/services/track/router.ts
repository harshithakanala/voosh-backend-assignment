import express from 'express';
import { TrackController, TrackValidator } from './processes';
import { authenticate, authorize } from '../../middlewares/auth.middleware';

const router = express.Router();

router.get('/', authenticate, authorize(['Admin', 'Editor']), TrackValidator.validateGetTracks, TrackController.getTracks);

router.get('/:id', authenticate, authorize(['Admin', 'Editor']), TrackValidator.validateGetTrackById, TrackController.getTrackById);

router.post('/add-track', authenticate, authorize(['Admin']), TrackValidator.validateAddTrack, TrackController.addTrack);

router.put('/:id', authenticate, authorize(['Admin', 'Editor']), TrackValidator.validateUpdateTrack, TrackController.updateTrack);

router.delete('/:id', authenticate, authorize(['Admin', 'Editor']), TrackValidator.validateDeleteTrack, TrackController.deleteTrack);

export { router as TrackRouteService };
