import express from 'express';
import { FavoriteController, FavoriteValidator } from './processes';
import { authenticate, authorize } from '../../middlewares/auth.middleware';

const router = express.Router();

router.post('/add-favorite', authenticate, authorize(['Admin', 'Editor', 'Viewer']), FavoriteValidator.validateAddFavorite, FavoriteController.addFavoriteController);

router.get('/:category', authenticate, authorize(['Admin', 'Editor', 'Viewer']), FavoriteValidator.validateGetFavorites, FavoriteController.getFavorites);

router.delete('/remove-favorite/:id', authenticate, authorize(['Admin', 'Editor', 'Viewer']), FavoriteValidator.validateRemoveFavorite, FavoriteController.removeFavorite);

export { router as FavoriteRouteService };
