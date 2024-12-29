import express from 'express';
import { UserController, UserValidator } from './processes';
import { authenticate, authorize } from '../../middlewares/auth.middleware';

const router = express.Router();

router.get('/', authenticate, authorize(['Admin']), UserValidator.validateGetUsers, UserController.getUsers);

router.post('/add-user', authenticate, authorize(['Admin']), UserValidator.validateAddUser, UserController.addUser);

router.delete('/:id', authenticate, authorize(['Admin']), UserValidator.validateDeleteUser, UserController.deleteUser);

router.put('/update-password', authenticate, UserValidator.validateUpdatePassword, UserController.updatePassword);

export { router as UserRouteService };
