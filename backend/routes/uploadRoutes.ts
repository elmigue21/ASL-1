import { Router } from "express";
import { exportToExcel, uploadFile ,generatePdf,downloadFile,deleteFile,insertUpload} from "../controllers/uploadController";


import multer from "multer";
import fs from "fs";
import path from "path";

const router = Router();

// const uploadDir = path.join(__dirname, "uploads/");
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir);
// }

// const storage = multer.memoryStorage();

// const upload = multer({ storage });



// router.post("/uploadFile",upload.single('file'), uploadFile);
router.get("/exportExcel",exportToExcel);
router.get("/generatePdf", generatePdf);
router.get("/downloadFile", downloadFile);
router.delete("/deleteFile", deleteFile);
router.post("/insertUpload", insertUpload)




export default router;