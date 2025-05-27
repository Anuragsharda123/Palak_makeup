import { Router } from "express";
import { addNotes, addVideo, adminLogin, adminRegister, createCourse, createModule, getAllCourses, getBulkVideoUrls, getCourseModules, redirectTo, userLogin, userRegister } from "../controllers/userController";
import passport from "passport";
import upload from "../utils/multer";
import { authenticateJWT } from "../middlewares/userAuth";

const router = Router();

// POST APIs

    // Admin Routes
        router.post('/adminregister', authenticateJWT, adminRegister);
        router.post('/adminLogin', authenticateJWT, adminLogin);
        router.post("/addCourse", authenticateJWT, createCourse);
        router.post("/addModule", authenticateJWT, createModule);
        router.post("/videoupload", authenticateJWT, upload.single('video'), addVideo);

    // Student APIs
        router.post('/login', userLogin);
        router.post('/register', userRegister);
        router.post('/addNotes', authenticateJWT, addNotes)
        
        
        // Get APIs
        
        // Student APIs
        router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email", "https://www.googleapis.com/auth/user.phonenumbers.read", "https://www.googleapis.com/auth/user.addresses.read"], accessType: "offline", prompt: "consent"}));
        router.get("/auth/google/callback", passport.authenticate("google", { failureRedirect: "/login" }), redirectTo);
        router.get("/getCourses", authenticateJWT, getAllCourses);
        router.get("/getModuleByCourse", authenticateJWT, getCourseModules);
        router.get("/getall", getBulkVideoUrls);




export default router;