const logger = require('../logger/logger');

const connectDatabase = (mongoose, url) => {
    mongoose.connect(url)
    .then(() => {
        logger.info('MongoDB connected successfully')
    })
    .catch(err => logger.error('MongoDB connection error:', err));
};

module.exports = connectDatabase;
