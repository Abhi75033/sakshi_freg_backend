import Product from '../models/Product.js';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
    const products = await Product.find({});
    res.json(products);
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
    const { title, description, price, image, images, quantity, category, isNewProduct, isBestseller } = req.body;
    const product = new Product({
        title,
        description,
        price,
        image,
        images: images || (image ? [image] : []),
        quantity: quantity ?? 0,
        category,
        isNewProduct,
        isBestseller,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
    const { title, description, price, image, images, quantity, category, isNewProduct, isBestseller } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
        product.title = title || product.title;
        product.description = description || product.description;
        product.price = price !== undefined ? price : product.price;
        product.image = image || product.image;
        product.images = images !== undefined ? images : product.images;
        if (quantity !== undefined) product.quantity = quantity;
        product.category = category || product.category;
        if (isNewProduct !== undefined) product.isNewProduct = isNewProduct;
        if (isBestseller !== undefined) product.isBestseller = isBestseller;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        await Product.deleteOne({ _id: product._id });
        res.json({ message: 'Product removed' });
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
};
