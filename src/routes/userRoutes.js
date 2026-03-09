import express from 'express';
import {
    authUser,
    registerUser,
    getUserProfile,
    toggleWishlist,
    getWishlist,
    getUsers,
    getAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(registerUser).get(protect, admin, getUsers);
router.post('/login', authUser);
router.route('/profile').get(protect, getUserProfile);
router.route('/wishlist').get(protect, getWishlist).put(protect, toggleWishlist);

// Address routes
router.route('/addresses').get(protect, getAddresses).post(protect, addAddress);
router.route('/addresses/:addressId').put(protect, updateAddress).delete(protect, deleteAddress);
router.route('/addresses/:addressId/default').put(protect, setDefaultAddress);

export default router;

