/**
 * Formats a successful response payload.
 * @param {any} data - Data to return to the client.
 * @param {string} [message="Success"] - A human-readable success message.
 * @returns {object} The standard API response object.
 */
function success(data, message = 'Success') {
  return {
    success: true,
    message,
    data,
  };
}

/**
 * Formats an error response payload.
 * @param {string} message - A human-readable description of the error.
 * @param {any} [errors=null] - Additional validation or structured error details.
 * @returns {object} The standard API error response object.
 */
function error(message = 'An error occurred', errors = null) {
  const responsePayload = {
    success: false,
    message,
  };

  if (errors !== null && errors !== undefined) {
    responsePayload.errors = errors;
  }

  return responsePayload;
}

module.exports = {
  success,
  error,
};
