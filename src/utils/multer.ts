import multer from 'multer';
import path from 'path';


const storage = multer.memoryStorage(); // This will store the file in memory (not on disk)


// Configure storage for uploaded files
const CourseImgstorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'resume/'); // Specify the directory for storing uploaded files
  },
  filename: (req, file, cb) => {
    // Create a unique filename for each file
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Preserve original file extension
  }
});


const upload = multer({
    storage,
    limits: { fileSize: 500 * 1024 * 1024 }, // Limit file size to 500 MB
});


// Create an upload instance with file size limit and allowed file types
export const uploadCourseImg = multer({
  storage: CourseImgstorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5 MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg/; // Allowed file types
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Error: File type not allowed!'));
  }
});


export default upload;
