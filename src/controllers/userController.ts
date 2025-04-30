import { Response } from "express";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Local } from "../environment/env";
import User from "../models/user";
import Course from "../models/course";
import Module from "../models/module";
import Video from "../models/video";
import Admin from "../models/admin";

const Secret_key:any = Local.Secret_Key

// Error Response
const ServerErrorResponse = (res: Response) => {
    return res.status(500).json({message: "Something Went Wrong!"});
}

// POST Request
export const userLogin = async(req: any, res: Response):Promise<any> => {
    try{
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email:email } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        } else {
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: "Invalid password" });
            } else {
                const token = jwt.sign({ uuid: user.uuid, type: 1  }, Secret_key, );  // type 1 is for student
                return res.status(200).json({ "message":"Login successful" ,token, userType: 1 });
            }
        }
    } catch(err){
        // res.status(500).json({ message: "Internal server error", error: err });
        return ServerErrorResponse(res);
    }
};

// POST Request
export const adminLogin = async(req: any, res: Response): Promise<any> => {
    try{
        const { email, password } = req.body;
        const admin = await Admin.findOne({ where: { email:email } });
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        } else {
            const isMatch = await bcrypt.compare(password, admin.password);
            if (!isMatch) {
                return res.status(401).json({ message: "Invalid password" });
            } else {
                const token = jwt.sign({ uuid: admin.uuid, type: admin.adminType  }, Secret_key, );
                return res.status(200).json({ "message":"Login successful" ,token, userType: admin.adminType });
            }
        }
    } catch(err){
        // res.status(500).json({ message: "Internal server error", error: err });
        return ServerErrorResponse(res);
    }
}

// POST Request
export const userRegister = async (req: any, res: Response): Promise<any> => {
    try{
        const { email, password } = req.body;
        const isExist = await User.findOne({where: {email : email}});
        if(!isExist){
            const hashedPassword = await bcrypt.hash(password, 10);
            await User.create({ email, password: hashedPassword });
            return res.status(201).json({"message": 'User registered successfully'});
        } else {
            return res.status(409).json({"message": 'User already exists'});
        }
    } catch(err){
        // res.status(500).json({ message: "Internal server error", error: err });
        return ServerErrorResponse(res);
    }
};

// POST Request
export const adminRegister = async (req: any, res: Response): Promise<any> => {
    try{
        const { email, password, adminType } = req.body;
        const isExist = await Admin.findOne({where: {email : email}});
        if(!isExist){
            const hashedPassword = await bcrypt.hash(password, 10);
            await Admin.create({ email, password: hashedPassword, adminType });
            if(adminType==2){
                return res.status(201).json({"message": 'Admin Created successfully'});
            } else {
                return res.status(201).json({"message": 'SuperAdmin Created successfully'});
            }
        } else {
            return res.status(409).json({"message": 'Admin/SuperAdmin already exists'});
        }
    }catch(err){
        return ServerErrorResponse(res);
    }
}

// GET Request
export const redirectTo = (res: Response): any => {
    try{
        return res.redirect("http://localhost:5173/student/dashboard")
    } catch(err){
        // res.status(500).json({ message: "Internal server error", error: err });
        return ServerErrorResponse(res);
    }
}

// POST Request
export const createCourse = async (req: any, res: Response): Promise<any> => {
    try{
        const {courseName} = req.body;
        const newCourse = await Course.create({
            courseName
        });

        if(newCourse){
            return res.status(200).json({message: "Cousrse Created Successfully!"});
        } else {
            return res.status(500).json({message: "Cousrse Creation Failed!"});
        }
        
    } catch(err){
        // res.status(500).json({message: "Something Went Wrong!"});
        return ServerErrorResponse(res);
    }
}

// POST Request
export const createModule = async (req: any, res:Response): Promise<any> => {
    try{
        const {moduleName, courseId} = req.body;
        const newModule = await Module.create({
            moduleName,
            courseId
        });

        if(newModule){
            return res.status(200).json({message: "Module Created Successfully!"});
        } else {
            return res.status(500).json({message: "Cousrse Creation Failed!"});
        }

    } catch(err){
        return ServerErrorResponse(res);
    }
}

// POST Request
export const addVideo = async (req: any, res: Response): Promise<any> => {
    try{
        const {videoName, moduleId} = req.body;
        const newVideo = await Video.create({
            videoName,
            moduleId
        });
        if(newVideo){
            return res.status(200).json({url: "", savedStatus: 1});
        } else {
            return res.status(500).json({message: "Video uploading Failed!"});
        }
    } catch(err){
        return ServerErrorResponse(res);
    }
}

// GET Request
export const getAllCourses = async (req:any, res: Response): Promise<any> => {
    try{
        const {uuid} = req.user;
        const courses = await Course.findAll();
        if(courses.length>0){
            return res.status(200).json({courses, "message": "Courses fetched"});
        } else {
            return res.status(200).json({message: "Currently there is no any coures Existed! "});
        }
    } catch(err){
        return ServerErrorResponse(res);
    }
}

// GET Request
export const getcourseModules = async (req:any, res: Response): Promise<any> => {
    try{
        const {uuid} = req.user;
        const {courseId} = req.query;
        const modules = await Module.findAll({where:{courseId: courseId}});
        if(modules.length>0){
            return res.status(200).json({modules, "message": "Modules fetched"});
        } else {
            return res.status(200).json({message: "Currently, there is no any module Existed for this Course! "});
        }
    } catch(err){
        return ServerErrorResponse(res);
    }
}