import { Router } from "express";
import { addVideo, adminLogin, adminRegister, createCourse, createModule, getAllCourses, getCourseModules, redirectTo, userLogin, userRegister } from "../controllers/userController";
import passport from "passport";
import upload from "../utils/multer";
import { authenticateJWT } from "../middlewares/userAuth";

const router = Router();

// POST APIs
router.post('/login', userLogin);
router.post('/adminLogin', authenticateJWT, adminLogin);
router.post('/register', userRegister);
router.post('/adminregister', authenticateJWT, adminRegister);
router.post("/addCourse", authenticateJWT, createCourse);
router.post("/addModule", authenticateJWT, createModule);
router.post("/videoupload", authenticateJWT, upload.single('video'), addVideo);

// Get APIs
router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/auth/google/callback", passport.authenticate("google", { failureRedirect: "/login" }), redirectTo);
router.get("/getCourses", authenticateJWT, getAllCourses);
router.get("/getModuleByCourse", authenticateJWT, getCourseModules);


export default router;