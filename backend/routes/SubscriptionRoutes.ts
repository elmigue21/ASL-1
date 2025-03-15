import { Router } from "express";
import { getAllSubscriptions,createSubscription,getSubscriptionById,updateSubscription,deleteSubscription} from "../controllers/SubscriptionController";

const router = Router();

router.get("/", getAllSubscriptions);

export default router;