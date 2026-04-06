import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure uploads/attachments directory exists
const uploadDir = path.join(process.cwd(), "uploads", "attachments");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (
  _req: any,
  file: any,
  cb: any
) => {
  // Allow common office/image/pdf formats
  const allowedExts = /jpeg|jpg|png|webp|pdf|doc|docx|xls|xlsx|txt|zip/;
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedExts.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error("File type not supported for attachments."), false);
  }
};

export const uploadAttachment = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20 MB for email attachments
  },
});
