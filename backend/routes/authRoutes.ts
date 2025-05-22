import {Router} from "express";
import { login,register, logout ,getRole,checkAuth} from "../controllers/authController";
import { authenticateUser } from "../middlewares/authenticateUser";
// route r.get("/backupData", backupData);
const router = Router();

router.get("/",authenticateUser, checkAuth)
router.get("/getRole",getRole);
router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);

export default router;
