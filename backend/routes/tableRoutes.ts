import { Router } from "express";
import { getAllSubscriptions } from "../controllers/tableController";

const router = Router();

router.get("/", getAllSubscriptions);



export default router;