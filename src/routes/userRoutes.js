import express from 'express';
import {
    authUser,
    registerUser,
    getUserProfile,
    toggleWishlist,
    getWishlist,
    getUsers,
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(registerUser).get(protect, admin, getUsers);
router.post('/login', authUser);
router
    .route('/profile')
    .get(protect, getUserProfile)
router
    .route('/wishlist')
    .get(protect, getWishlist)
    .put(protect, toggleWishlist);

export default router;
