const express = require('express');
const db = require('../db');
const config = require('../config');
const { authenticate, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { findDepartmentForReport, categoryTypeMap } = require('../services/routingService');

const router = express.Router();
const allowedCategories = new Set(Object.keys(categoryTypeMap));

router.post('/', authenticate, upload.single('image'), async (req, res, next) => {
  try {
    const { title, description, category, latitude, longitude } = req.body;

    if (!title || !description || !category || latitude === undefined || longitude === undefined) {
      return res.status(400).json({ message: 'title, description, category, latitude, and longitude are required' });
    }

    if (!allowedCategories.has(category)) {
      return res.status(400).json({ message: `Invalid category. Allowed: ${Array.from(allowedCategories).join(', ')}` });
    }

    const lat = Number(latitude);
    const lon = Number(longitude);

    if (!Number.isFinite(lat) || !Number.isFinite(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      return res.status(400).json({ message: 'Invalid coordinates' });
    }

    const department = await findDepartmentForReport({
      latitude: lat,
      longitude: lon,
      category
    });

    const imageUrl = req.file ? `${config.uploadsBaseUrl}/uploads/${req.file.filename}` : null;

    const insert = await db.query(
      `
        INSERT INTO reports (
          user_id,
          title,
          description,
          category,
          status,
          location,
          assigned_department_id,
          image_url
        )
        VALUES (
          $1, $2, $3, $4, 'submitted',
          ST_SetSRID(ST_MakePoint($5, $6), 4326)::geography,
          $7,
          $8
        )
        RETURNING id, user_id, title, description, category, status,
                  ST_Y(location::geometry) AS latitude,
                  ST_X(location::geometry) AS longitude,
                  assigned_department_id, image_url, created_at, updated_at
      `,
      [req.user.id, title, description, category, lon, lat, department ? department.id : null, imageUrl]
    );

    return res.status(201).json({
      report: insert.rows[0],
      routed_department: department
    });
  } catch (error) {
    return next(error);
  }
});

router.get('/me', authenticate, async (req, res, next) => {
  try {
    const result = await db.query(
      `
        SELECT id, user_id, title, description, category, status,
               ST_Y(location::geometry) AS latitude,
               ST_X(location::geometry) AS longitude,
               assigned_department_id, image_url, created_at, updated_at
        FROM reports
        WHERE user_id = $1
        ORDER BY created_at DESC
      `,
      [req.user.id]
    );

    return res.json({ reports: result.rows });
  } catch (error) {
    return next(error);
  }
});

router.get('/', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const result = await db.query(
      `
        SELECT id, user_id, title, description, category, status,
               ST_Y(location::geometry) AS latitude,
               ST_X(location::geometry) AS longitude,
               assigned_department_id, image_url, created_at, updated_at
        FROM reports
        ORDER BY created_at DESC
      `
    );

    return res.json({ reports: result.rows });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
