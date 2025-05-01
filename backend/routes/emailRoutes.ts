import { Router } from "express";
import {sendEmails, verifyEmail} from '../controllers/emailController'

const router = Router();

// router.get("/", getAllSubscriptions);
router.post("/sendEmails",sendEmails);
router.get("/verifyEmail", verifyEmail);



export default router;