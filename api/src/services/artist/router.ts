import express from 'express';
import { ArtistController, ArtistValidator } from './processes';
import { authenticate, authorize } from '../../middlewares/auth.middleware';

const router = express.Router();

router.get('/', authenticate, authorize(['Admin', 'Editor']), ArtistValidator.validateGetArtists, ArtistController.getArtists);

router.get('/:id', authenticate, authorize(['Admin', 'Editor']), ArtistValidator.validateGetArtistById, ArtistController.getArtistById);

router.post('/add-artist', authenticate, authorize(['Admin']), ArtistValidator.validateAddArtist, ArtistController.addArtist);

router.put('/:id', authenticate, authorize(['Admin', 'Editor']), ArtistValidator.validateUpdateArtist, ArtistController.updateArtist);

router.delete('/:id', authenticate, authorize(['Admin', 'Editor']), ArtistValidator.validateDeleteArtist, ArtistController.deleteArtist);

export { router as ArtistRouteService };
