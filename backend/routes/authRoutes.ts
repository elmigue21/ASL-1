import {Router} from "express";
import { login,register, logout ,getRole} from "../controllers/authController";
// route r.get("/backupData", backupData);
const router = Router();
router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);
router.get("/role",getRole);

export default router;
