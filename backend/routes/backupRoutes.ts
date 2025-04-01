import { Router } from "express";
import { backupData } from "../controllers/backupController";
const router = Router();

router.get("/backupData", backupData);



export default router;