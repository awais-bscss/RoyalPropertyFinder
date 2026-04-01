import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), "uploads", "listings");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    // e.g.  1709999999999-myimage.jpg
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedImages = /jpeg|jpg|png|webp/;
  const allowedVideos = /mp4|mov|avi|mkv|webm/;
  
  const ext = path.extname(file.originalname).toLowerCase();
  const isImage = allowedImages.test(ext) || allowedImages.test(file.mimetype);
  const isVideo = allowedVideos.test(ext) || allowedVideos.test(file.mimetype);

  if (isImage || isVideo) {
    cb(null, true);
  } else {
    cb(new Error("Only image (jpeg, jpg, png, webp) or video (mp4, mov, avi, mkv, webm) files are allowed"));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50 MB
    files: 23,                    // 20 images + 3 videos
  },
});



