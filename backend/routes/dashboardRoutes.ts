import { Router } from "express";
import {getCountryCount} from "../controllers/dashboardController";

const router = Router();

// router.get("/", getAllSubscriptions);
// router.get("/subCount",getSubCount);
// router.get("/activeCount", getActiveSubsCount);
// router.get("/inactiveCount",getInactiveSubsCount);
router.get("/countryCount", getCountryCount);


export default router;