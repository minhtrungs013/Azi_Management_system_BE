const sendResponse = (res, message, status, data = null) => {
    const responseData = {
      message: message,
      status: status,
      data: data
    };
  
    // Gửi phản hồi về client dưới dạng JSON
    res.status(status).json(responseData);
  };
  
  module.exports = sendResponse;