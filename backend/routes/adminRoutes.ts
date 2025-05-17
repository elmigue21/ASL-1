import {Router} from "express";
import { getEmployees} from "../controllers/adminController";
// route r.get("/backupData", backupData);
const router = Router();


router.get("/employees", getEmployees);


export default router;
