const multer = require('multer')
const path = require('path')

const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN

// Local development: write to the existing public/images directory (unchanged).
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/images'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Production (Vercel): Functions have a read-only filesystem, so newly uploaded
// images are stored in durable Vercel Blob storage instead. `file.filename` is
// set to the public blob URL, which controllers save in the existing image
// fields. Existing filenames in the database keep resolving to /public/images.
let storage = diskStorage;

if (BLOB_TOKEN) {
  const { put } = require('@vercel/blob');

  storage = {
    _handleFile(req, file, cb) {
      const chunks = [];
      file.stream.on('data', (chunk) => chunks.push(chunk));
      file.stream.on('error', (err) => cb(err));
      file.stream.on('end', async () => {
        try {
          const buffer = Buffer.concat(chunks);
          const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
          const pathname = `product-images/${Date.now()}-${safeName}`;
          const blob = await put(pathname, buffer, {
            access: 'public',
            token: BLOB_TOKEN,
            contentType: file.mimetype,
            addRandomSuffix: true,
          });
          cb(null, { filename: blob.url, path: blob.url, size: buffer.length });
        } catch (err) {
          cb(err);
        }
      });
    },
    _removeFile(req, file, cb) {
      cb(null);
    }
  };
}

// Create the multer instance that accepts any field name
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Accept image files only
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

module.exports = upload;