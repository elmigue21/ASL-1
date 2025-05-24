import {Router} from "express";
import { getEmployees,deleteEmployee} from "../controllers/adminController";
// route r.get("/backupData", backupData);
const router = Router();


router.get("/employees", getEmployees);
router.delete("/employeeDelete",deleteEmployee)


export default router;
