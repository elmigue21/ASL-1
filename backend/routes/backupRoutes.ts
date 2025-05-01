import { Router } from "express";
import { /* backupBucket, */ backupData, getBackup, grabBucket } from "../controllers/backupController";
const router = Router();

router.get("/backupData", backupData);
router.get("/getBackups",getBackup);
// router.get("/backupBucket", backupBucket);
router.get("/grabBucket",grabBucket);



export default router;