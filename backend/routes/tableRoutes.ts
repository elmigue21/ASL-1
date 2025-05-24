import { Router } from "express";
import { archiveSubscriber, getAllSubscriptions, getTableCount } from "../controllers/tableController";

const router = Router();

router.get("/", getAllSubscriptions);
router.get("/tableCount", getTableCount);
router.get("/archive", archiveSubscriber)



export default router;