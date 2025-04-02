import { Router } from "express";
import { createSubscription,deleteSubscription,editSubscription} from "../controllers/SubscriptionController";

const router = Router();

router.post("/create", createSubscription);
router.delete('/delete',deleteSubscription);



export default router;