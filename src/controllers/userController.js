import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
export const authUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
};

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400).json({ message: 'User already exists' });
        return;
    }

    const user = await User.create({
        name,
        email,
        password,
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            savedAddress: user.savedAddress,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Toggle item in wishlist
// @route   PUT /api/users/wishlist
// @access  Private
export const toggleWishlist = async (req, res) => {
    const { productId } = req.body;
    const user = await User.findById(req.user._id);

    if (user) {
        const isLiked = user.wishlist.includes(productId);
        if (isLiked) {
            user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
        } else {
            user.wishlist.push(productId);
        }
        await user.save();

        // populate the new wishlist to return
        const updatedUser = await User.findById(req.user._id).populate('wishlist');
        res.json(updatedUser.wishlist);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Get user wishlist
// @route   GET /api/users/wishlist
// @access  Private
export const getWishlist = async (req, res) => {
    const user = await User.findById(req.user._id).populate('wishlist');
    if (user) {
        res.json(user.wishlist);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = async (req, res) => {
    const users = await User.find({});
    res.json(users);
};
