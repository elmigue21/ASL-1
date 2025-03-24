import { Router } from "express";
import { getAllSubscriptions,createSubscription,getSubscriptionById,updateSubscription,deleteSubscription, getActiveSubsCount, getInactiveSubsCount, getSubCount, getCountryCount} from "../controllers/SubscriptionController";

const router = Router();

router.get("/", getAllSubscriptions);
router.get("/subCount",getSubCount);
router.get("/activeCount", getActiveSubsCount);
router.get("/inactiveCount",getInactiveSubsCount);
router.get("/countryCount", getCountryCount);


export default router;