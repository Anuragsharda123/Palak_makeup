import { Router } from "express";
import { userLogin } from "../controllers/userController";

const router = Router();

router.post('/login', userLogin);

export default router;