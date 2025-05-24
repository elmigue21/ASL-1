import { Router } from "express";
import { backupBucket, /* backupData, */ getBackups, getReportsAndExcel, grabBucket, deleteBackup } from "../controllers/backupController";
const router = Router();

// route r.get("/backupData", backupData);
router.get("/getBackups",getBackups);
router.get("/backupBucket", backupBucket);
router.get("/grabBucket",grabBucket);
router.get("/getReportsAndExcel",getReportsAndExcel);
router.delete("/delete", deleteBackup);



export default router;