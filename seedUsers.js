import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

async function createAdmin() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    const User = mongoose.model('User', new mongoose.Schema({
        name: String,
        email: { type: String, unique: true },
        password: String,
        role: { type: String, default: 'user' },
        wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
        savedAddress: mongoose.Schema.Types.Mixed,
    }, { timestamps: true }));

    const usersToSeed = [
        { name: 'Admin User', email: 'admin@example.com', password: bcrypt.hashSync('123456', 10), role: 'admin' },
        { name: 'John Doe', email: 'john@example.com', password: bcrypt.hashSync('123456', 10) },
        { name: 'Jane Doe', email: 'jane@example.com', password: bcrypt.hashSync('123456', 10) },
    ];

    for (const u of usersToSeed) {
        // updateOne with upsert so existing docs are fully replaced
        await User.updateOne({ email: u.email }, { $set: u }, { upsert: true });
        console.log(`Upserted: ${u.email}`);
    }

    console.log('Done!');
    process.exit(0);
}

createAdmin().catch(err => { console.error(err); process.exit(1); });
