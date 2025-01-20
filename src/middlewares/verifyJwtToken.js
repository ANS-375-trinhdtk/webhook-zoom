const verifyJwt = require('../utils/verifyJwt');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');

const verifyJwtToken = () => async (req, res, next) => {
    const token = req.headers['authorization'];
    
    if (!token || !await verifyJwt(token)) {
      return next(new ApiError(httpStatus.BAD_REQUEST, 'Unauthorized'));
    }
    return next();
}

module.exports = verifyJwtToken;