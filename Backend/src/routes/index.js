const express = require('express');
const prisma = require('../config/prisma');

const router = express.Router();

router.get('/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    
    return res.status(200).json({
      success: true,
      db: 'connected',
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      db: 'disconnected',
      error: err.message,
    });
  }
});

module.exports = router;
