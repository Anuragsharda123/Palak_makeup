import { Router } from "express";
import { addNotes, addVideo, adminLogin, adminRegister, createCourse, createModule, deleteStudent, generateCertificate, getAllCourses, getCertificate, getCourseDetail, getCourseModules, getStudentCourses, getStudentCourseVideos, getUserNotes, redirectTo, updateStudentPassword, updateStudentProfile, userLogin, userRegister } from "../controllers/userController";
import passport from "passport";
import upload from "../utils/multer";
import { authenticateJWT } from "../middlewares/userAuth";

const router = Router();

// POST APIs

    // Admin Routes
        router.post('/adminregister', authenticateJWT, adminRegister);
        router.post('/adminLogin', authenticateJWT, adminLogin);
        // router.post("/addCourse", authenticateJWT, createCourse);
        router.post("/addCourse", createCourse);
        
        // router.post("/addModule", authenticateJWT, createModule);
        router.post("/addModule", createModule);
        
        router.post("/videoupload", upload.single('video'), addVideo);
        // router.post("/videoupload", authenticateJWT, upload.single('video'), addVideo);

    // Student APIs
        router.post('/login', userLogin); // done
        router.post('/register', userRegister); // done
        router.post('/addNotes', authenticateJWT, addNotes) // done
        // router.post('/addNotes', addNotes) // done

        // router.post('/generateCertificate', authenticateJWT, generateCertificate);
        router.post('/generateCertificate', generateCertificate);
        
        
// Get APIs
        
    // Student APIs
        router.get("/StudentCourses", getStudentCourses)

        router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"]})); // Done
        router.get("/auth/google/callback", passport.authenticate("google", { failureRedirect: "/login" }), redirectTo); // Done page Testing Pending
        router.get("/getAllCourses", authenticateJWT, getAllCourses);
        router.get("/getModuleByCourse", authenticateJWT, getCourseModules);
        // router.get("/CourseDetail", authenticateJWT, getCourseDetail);
        router.get("/CourseDetail", getCourseDetail);
        
        // router.get("/getCourseVideos", authenticateJWT, getStudentCourseVideos);
        router.get("/getCourseVideos", getStudentCourseVideos);
        
        router.get("/getNotes", authenticateJWT, getUserNotes); // Done
        // router.get("/getNotes", getUserNotes); // Done


// PUT APIs

    // Student APIs
        router.put("/updateStudentPassword", authenticateJWT, updateStudentPassword);
        router.put("/updateStudentProfile", authenticateJWT, updateStudentProfile);
        // router.get("/getCertificate", authenticateJWT, getCertificate)
        router.get("/getCertificate", getCertificate)

// DELETE APIs

    // Student APIs

        router.delete("deleteStudent", authenticateJWT, deleteStudent);


export default router;