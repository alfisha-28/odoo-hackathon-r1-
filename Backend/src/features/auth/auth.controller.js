const asyncHandler = require('../../lib/asyncHandler');
const ApiResponse = require('../../lib/ApiResponse');
const authService = require('./auth.service');

const signup = asyncHandler(async (req, res) => {
  const employee = await authService.signup(req.body);
  ApiResponse.created(res, { employee }, 'Account created. Please log in.');
});

const login = asyncHandler(async (req, res) => {
  const { token, employee } = await authService.login(req.body);
  ApiResponse.success(res, { token, employee }, 'Login successful');
});

/**
 * Logout — stateless JWT; no server-side invalidation.
 * KNOWN LIMITATION: Tokens remain valid until expiry. A token blacklist
 * (e.g. Redis) is deferred to Phase 2 scope.
 */
const logout = asyncHandler(async (req, res) => {
  ApiResponse.success(res, null, 'Logged out successfully. Please discard your token client-side.');
});

module.exports = { signup, login, logout };
