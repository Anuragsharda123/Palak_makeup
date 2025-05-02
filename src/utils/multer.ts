import multer from 'multer';

const storage = multer.memoryStorage(); // This will store the file in memory (not on disk)
const upload = multer({
    storage,
    limits: { fileSize: 100 * 1024 * 1024 }, // Limit file size to 100 MB
});

export default upload;