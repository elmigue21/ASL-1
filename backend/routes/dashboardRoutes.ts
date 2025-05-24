import { Router } from "express";
import {getCountryCount, getSubCount,getActiveSubsCount,getInactiveSubsCount,getNewSubscribers/* ,getCountries */} from "../controllers/dashboardController";
import { authenticateUser } from "../middlewares/authenticateUser";

const router = Router();

// router.get("/", getAllSubscriptions);
router.get("/subCount",getSubCount);
router.get("/activeCount", getActiveSubsCount);
router.get("/inactiveCount",getInactiveSubsCount);
router.get("/countryCount", getCountryCount);
router.get("/newSubs/dateRange", getNewSubscribers);
// router.get("/getCountries",getCountries);


export default router;