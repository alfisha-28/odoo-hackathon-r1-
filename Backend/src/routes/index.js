const express = require('express');
const prisma = require('../config/prisma');

const authRouter = require('../features/auth/auth.routes');
const departmentsRouter = require('../features/departments/departments.routes');
const categoriesRouter = require('../features/categories/categories.routes');
const employeesRouter = require('../features/employees/employees.routes');
const assetsRouter = require('../features/assets/assets.routes');

const router = express.Router();

// Health check
router.get('/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return res.status(200).json({ success: true, db: 'connected' });
  } catch (err) {
    return res.status(500).json({ success: false, db: 'disconnected', error: err.message });
  }
});

// Phase 1 feature routes
router.use('/auth', authRouter);
router.use('/departments', departmentsRouter);
router.use('/categories', categoriesRouter);
router.use('/employees', employeesRouter);

// Phase 2 feature routes
router.use('/assets', assetsRouter);

module.exports = router;
