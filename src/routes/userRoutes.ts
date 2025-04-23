import { Router } from "express";
import { afterLogin, userLogin, userRegister } from "../controllers/userController";
import passport from "passport";

const router = Router();

router.post('/login', userLogin);
router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/auth/google/callback", passport.authenticate("google", { failureRedirect: "/login" }), afterLogin);
router.post('/register', userRegister);

export default router;