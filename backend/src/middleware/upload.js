const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadPath = path.resolve(__dirname, '../../uploads');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadPath),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeName = file.originalname.replace(/[^a-zA-Z0-9-_\.]/g, '_').slice(0, 50);
    cb(null, `${Date.now()}-${safeName}${ext && safeName.endsWith(ext) ? '' : ext}`);
  }
});

const allowedMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);

const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      return cb(new Error('Only JPEG, PNG, and WEBP images are allowed'));
    }
    cb(null, true);
  }
});

module.exports = upload;
