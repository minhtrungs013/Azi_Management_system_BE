const logger = require('../logger/logger');

const corsOptions = {
    origin: (origin, callback) => {
        const allowedOrigins = ['http://localhost:3000','http://localhost:5500']; // Các client (domain) được phép truy cập
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            // Nếu không có origin hoặc origin nằm trong danh sách cho phép
            callback(null, true);
        } else {
            // Nếu origin không nằm trong danh sách, từ chối yêu cầu
            logger.error(`CORS request rejected from ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Các phương thức HTTP được phép
    allowedHeaders: ['Content-Type', 'Authorization'], // Các header được phép
    credentials: true // Cho phép gửi cookies và thông tin bảo mật khác
};

module.exports = corsOptions;
