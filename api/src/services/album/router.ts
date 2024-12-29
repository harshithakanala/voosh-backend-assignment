import express from 'express';
import { AlbumController, AlbumValidator } from './processes';
import { authenticate, authorize } from '../../middlewares/auth.middleware';

const router = express.Router();

router.get('/', authenticate, authorize(['Admin', 'Editor']), AlbumValidator.validateGetAlbums, AlbumController.getAlbums);

router.get('/:id', authenticate, authorize(['Admin', 'Editor']), AlbumValidator.validateGetAlbumById, AlbumController.getAlbumById);

router.post('/add-album', authenticate, authorize(['Admin']), AlbumValidator.validateAddAlbum, AlbumController.addAlbum);

router.put('/:id', authenticate, authorize(['Admin', 'Editor']), AlbumValidator.validateUpdateAlbum, AlbumController.updateAlbum);

router.delete('/:id', authenticate, authorize(['Admin', 'Editor']), AlbumValidator.validateDeleteAlbum, AlbumController.deleteAlbum);

export { router as AlbumRouteService };
