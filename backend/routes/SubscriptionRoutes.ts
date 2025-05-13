import { Router } from "express";
import { createSubscription,deleteSubscription,editSubscription, getSubscription} from "../controllers/SubscriptionController";

const router = Router();

router.post("/create", createSubscription);
router.delete('/delete',deleteSubscription);
router.get("/:id", getSubscription)



export default router;