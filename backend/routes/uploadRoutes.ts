import { Router } from "express";
import { exportToExcel, uploadFile ,generatePdf,downloadFile} from "../controllers/uploadController";


import multer from "multer";
import fs from "fs";
import path from "path";

const router = Router();

const uploadDir = path.join(__dirname, "uploads/");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer storage configuration
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/"); // Upload to 'uploads/' directory
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + file.originalname); // Unique filename based on timestamp
//   },
// });
const storage = multer.memoryStorage();
// Initialize multer
const upload = multer({ storage });



router.post("/uploadFile",upload.single('file'), uploadFile);
router.get("/exportExcel",exportToExcel);
router.get("/generatePdf", generatePdf);
router.get("/downloadFile", downloadFile);




export default router;