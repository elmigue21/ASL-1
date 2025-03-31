import { Router } from "express";
import { createSubscription} from "../controllers/SubscriptionController";

const router = Router();

router.post("/create", createSubscription);



export default router;