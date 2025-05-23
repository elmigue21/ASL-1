import { Router } from "express";
import {sendEmails/* , verifyEmail */} from '../controllers/emailController'
import multer from "multer";

// Use memory storage so files are available in `req.files` as buffers
const upload = multer({ storage: multer.memoryStorage() });


const router = Router();

// router.get("/", getAllSubscriptions);
router.post("/sendEmails", upload.any(),sendEmails);
// router.get("/verifyEmail", verifyEmail);



export default router;