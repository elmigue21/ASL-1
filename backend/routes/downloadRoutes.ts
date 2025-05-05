import { Router } from "express";
import { downloadFile } from "../controllers/downloadController";

const router = Router();

// router.get("/", getAllSubscriptions);
router.get("/downloadFile",downloadFile);



export default router;