const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  port: Number(process.env.PORT || 5000),
  jwtSecret: process.env.JWT_SECRET || 'unsafe-default-secret',
  databaseUrl: process.env.DATABASE_URL,
  uploadsBaseUrl: process.env.UPLOADS_BASE_URL || 'http://localhost:5000'
};
