import { Router } from "express";
import {sendEmails} from '../controllers/emailController'

const router = Router();

// router.get("/", getAllSubscriptions);
router.post("/sendEmails",sendEmails);



export default router;