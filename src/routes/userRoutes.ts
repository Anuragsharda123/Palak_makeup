import { Router } from "express";
import { addNotes, addVideo, adminLogin, adminRegister, createCourse, createModule, getAllCourses, getBulkVideoUrls, getCourseModules, getUserNotes, redirectTo, userLogin, userRegister } from "../controllers/userController";
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
        router.post('/login', userLogin); // done
        router.post('/register', userRegister); // done
        router.post('/addNotes', authenticateJWT, addNotes) // done
        
        
        // Get APIs
        
        // Student APIs
        router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"]})); // Done
        router.get("/auth/google/callback", passport.authenticate("google", { failureRedirect: "/login" }), redirectTo); // Done page Testing Pending
        router.get("/getCourses", authenticateJWT, getAllCourses);
        router.get("/getModuleByCourse", authenticateJWT, getCourseModules);
        router.get("/getall", getBulkVideoUrls);
        router.get("/getNotes", authenticateJWT, getUserNotes); // Done




export default router;