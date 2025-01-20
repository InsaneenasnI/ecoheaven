const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB připojeno: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Chyba: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB; 