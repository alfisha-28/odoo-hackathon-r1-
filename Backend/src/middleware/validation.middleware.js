const { ZodError } = require('zod');
const ApiError = require('../lib/ApiError');

const validate = (schema) => (req, res, next) => {
  try {
    const parsed = schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    req.body = parsed.body ?? req.body;
    req.query = parsed.query ?? req.query;
    req.params = parsed.params ?? req.params;
    next();
  } catch (err) {
    if (err instanceof ZodError) {
      const messages = (err.errors ?? []).map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      }));
      return next(ApiError.validation('Validation failed', messages));
    }
    next(err);
  }
};

module.exports = { validate };
