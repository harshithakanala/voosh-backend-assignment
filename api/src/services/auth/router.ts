import express from 'express';
import { AuthController, AuthValidator } from './processes';

const router = express.Router();

// Signup route
router.post('/signup', AuthValidator.validateSignup, AuthController.signupUser);

// Login route
router.post('/login', AuthValidator.validateSignup, AuthController.loginUser);

// Logout route
router.get('/logout', AuthController.logoutUser);

export { router as AuthRouteService };