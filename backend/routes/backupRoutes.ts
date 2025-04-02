import { Router } from "express";
import { backupData, getBackup } from "../controllers/backupController";
const router = Router();

router.get("/backupData", backupData);
router.get("/getBackups",getBackup)



export default router;