const asyncMiddleware = fn => async (req, res, next) => {
  return Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncMiddleware;
