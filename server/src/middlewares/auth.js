const ApiError = require('../exceptions/api-error')
const tokenService = require('../services/tokenService')

module.exports = function (req, res, next) {
  if (req.method === 'OPTIONS') {
    next();
  }

  try {
    const authorizationToken = req.headers.authorization;
    if (!authorizationToken){
      return next(ApiError.UnauthorizedError())
    }

    const accessToken = authorizationToken.split(' ')[1];
    if (!accessToken){
      return next(ApiError.UnauthorizedError())
    }

    const userData = tokenService.validateAccessToken(accessToken)
    if (!userData){
      return next(ApiError.UnauthorizedError())
    }

    req.user = userData
    next();

  } catch (e) {
    return next(ApiError.UnauthorizedError())
  }
}
