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
            addresses: user.addresses,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Get user addresses
// @route   GET /api/users/addresses
// @access  Private
export const getAddresses = async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user.addresses);
};

// @desc    Add a new address
// @route   POST /api/users/addresses
// @access  Private
export const addAddress = async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { label, name, street, city, state, zipCode, country, phone, isDefault } = req.body;

    // If new address is default, unset others
    if (isDefault) {
        user.addresses.forEach((addr) => { addr.isDefault = false; });
    }
    // First address is always default
    const makeDefault = isDefault || user.addresses.length === 0;

    user.addresses.push({ label, name, street, city, state, zipCode, country: country || 'India', phone, isDefault: makeDefault });
    await user.save();
    res.status(201).json(user.addresses);
};

// @desc    Update an address
// @route   PUT /api/users/addresses/:addressId
// @access  Private
export const updateAddress = async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const addr = user.addresses.id(req.params.addressId);
    if (!addr) return res.status(404).json({ message: 'Address not found' });

    const { label, name, street, city, state, zipCode, country, phone, isDefault } = req.body;

    if (isDefault) {
        user.addresses.forEach((a) => { a.isDefault = false; });
    }

    if (label !== undefined) addr.label = label;
    if (name !== undefined) addr.name = name;
    if (street !== undefined) addr.street = street;
    if (city !== undefined) addr.city = city;
    if (state !== undefined) addr.state = state;
    if (zipCode !== undefined) addr.zipCode = zipCode;
    if (country !== undefined) addr.country = country;
    if (phone !== undefined) addr.phone = phone;
    if (isDefault !== undefined) addr.isDefault = isDefault;

    await user.save();
    res.json(user.addresses);
};

// @desc    Delete an address
// @route   DELETE /api/users/addresses/:addressId
// @access  Private
export const deleteAddress = async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const addr = user.addresses.id(req.params.addressId);
    if (!addr) return res.status(404).json({ message: 'Address not found' });

    addr.deleteOne();
    // If deleted was default, make first remaining one default
    if (user.addresses.length > 0 && !user.addresses.some((a) => a.isDefault)) {
        user.addresses[0].isDefault = true;
    }
    await user.save();
    res.json(user.addresses);
};

// @desc    Set an address as default
// @route   PUT /api/users/addresses/:addressId/default
// @access  Private
export const setDefaultAddress = async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.addresses.forEach((a) => { a.isDefault = a._id.toString() === req.params.addressId; });
    await user.save();
    res.json(user.addresses);
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
