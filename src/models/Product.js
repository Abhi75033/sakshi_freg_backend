import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
            default: 0,
        },
        image: {
            type: String,
            required: true,
        },
        images: {
            type: [String],
            default: [],
        },
        quantity: {
            type: Number,
            required: true,
            default: 0,
        },
        category: {
            type: String,
        },
        isNewProduct: {
            type: Boolean,
            default: false,
        },
        isBestseller: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.model('Product', productSchema);

export default Product;
