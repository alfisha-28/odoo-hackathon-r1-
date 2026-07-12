const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

const hashPassword = (plaintext) => bcrypt.hash(plaintext, SALT_ROUNDS);

const comparePassword = (plaintext, hash) => bcrypt.compare(plaintext, hash);

module.exports = { hashPassword, comparePassword };
