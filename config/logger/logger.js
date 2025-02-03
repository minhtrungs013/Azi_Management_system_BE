const { createLogger, format, transports } = require('winston');

// Định nghĩa format log
const logFormat = format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Thêm timestamp
    format.printf(({ timestamp, level, message }) => `${timestamp} [${level.toUpperCase()}]: ${message}`) // Format thông báo log
);

// Tạo logger
const logger = createLogger({
    level: 'info', // Mức log mặc định là 'info', chỉ ghi log info trở lên
    format: logFormat,
    transports: [
        // Ghi log ra console cho tất cả các mức độ (info, warning, error)
        new transports.Console(),

        // Ghi log info vào file info.log (Chỉ lưu log có mức độ 'info')
        new transports.File({ filename: 'logs/info.log', level: 'info' }),

        // Ghi log warning vào file warning.log (Chỉ lưu log có mức độ 'warn' và 'error')
        new transports.File({ filename: 'logs/warning.log', level: 'warn' }),

        // Ghi log error vào file error.log (Chỉ lưu log có mức độ 'error')
        new transports.File({ filename: 'logs/error.log', level: 'error' })
    ],
    exceptionHandlers: [
        new transports.File({ filename: 'logs/exceptions.log' }) // Log các lỗi ngoại lệ không xử lý
    ]
});

module.exports = logger;
