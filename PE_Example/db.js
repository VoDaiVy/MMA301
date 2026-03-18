const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(
      'mongodb+srv://VoDaiVy:Daivyluonnoluc1324@PEP_ExampleMMA.ixjjuz5.mongodb.net/autorent_pro'
    );
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection failed', err);
    process.exit(1);
  }
};

module.exports = connectDB;
