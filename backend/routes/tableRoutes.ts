import { Router } from "express";
import { getAllSubscriptions, getTableCount } from "../controllers/tableController";

const router = Router();

router.get("/", getAllSubscriptions);
router.get("/tableCount", getTableCount);



export default router;