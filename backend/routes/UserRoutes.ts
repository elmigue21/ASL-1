import { Router } from "express";
import { getUsers } from "../controllers/UserController"; // Adjust path as needed

const router = Router();

router.get("/users", getUsers);

export default router;
