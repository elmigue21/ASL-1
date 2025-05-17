import {Router} from "express";
import { login,register, logout ,getRole} from "../controllers/authController";
// route r.get("/backupData", backupData);
const router = Router();

router.get("/getRole",getRole);
router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);


export default router;
