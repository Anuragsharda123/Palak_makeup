import { Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Local } from "../environment/env";
import Student from "../models/student";
import Course from "../models/course";
import Module from "../models/module";
import Video from "../models/video";
import Admin from "../models/admin";
import { generateUploadUrl } from "../utils/s3";
import { ListObjectsV2Command, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import s3 from "../config/aws";
import courseSubscription from "../models/courseSubscription";
import Notes from "../models/notes";
import { Op } from "sequelize";

const Secret_key: any = Local.Secret_Key;
const bucketName: any = Local.S3_Bucket_Name;

// Error Response
const ServerErrorResponse = (res: Response, err: any) => {
  return res.status(500).json({ message: `Something Went Wrong! ${err}  ` });
};

// POST Request
export const userLogin = async (req: any, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;
    const user = await Student.findOne({ where: { email: email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    } else {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid password" });
      } else {
        const token = jwt.sign({ uuid: user.uuid, type: 1 }, Secret_key); // type 1 is for student
        return res
          .status(200)
          .json({ message: "Login successful", token, userType: 1 });
      }
    }
  } catch (err) {
    // res.status(500).json({ message: "Internal server error", error: err });
    return ServerErrorResponse(res, err);
  }
};

// POST Request
export const adminLogin = async (req: any, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ where: { email: email } });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    } else {
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid password" });
      } else {
        const token = jwt.sign(
          { uuid: admin.uuid, type: admin.adminType },
          Secret_key
        );
        return res.status(200).json({
          message: "Login successful",
          token,
          userType: admin.adminType,
        });
      }
    }
  } catch (err) {
    // res.status(500).json({ message: "Internal server error", error: err });
    return ServerErrorResponse(res, err);
  }
};

// POST Request
export const userRegister = async (req: any, res: Response): Promise<any> => {
  try {
    const { email, password, FirstName, LastName, PhoneNo, Address, City, Age  } = req.body;
    const isExist = await Student.findOne({ where: { email: email } });
    if (!isExist) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await Student.create({
        email,
        password: hashedPassword,
        firstName: FirstName,
        lastName: LastName,
        phoneNo: PhoneNo,
        city: City,
        age: Age,
        address: Address
      });
      return res.status(201).json({ message: "User registered successfully" });
    } else {
      return res.status(409).json({ message: "User already exists" });
    }
  } catch (err) {
    // res.status(500).json({ message: "Internal server error", error: err });
    return ServerErrorResponse(res, err);
  }
};

// POST Request
export const adminRegister = async (req: any, res: Response): Promise<any> => {
  try {
    const { email, password, adminType } = req.body;
    const isExist = await Admin.findOne({ where: { email: email } });
    if (!isExist) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await Admin.create({ email, password: hashedPassword, adminType });
      if (adminType == 2) {
        return res.status(201).json({ message: "Admin Created successfully" });
      } else {
        return res
          .status(201)
          .json({ message: "SuperAdmin Created successfully" });
      }
    } else {
      return res
        .status(409)
        .json({ message: "Admin/SuperAdmin already exists" });
    }
  } catch (err) {
    return ServerErrorResponse(res, err);
  }
};

// GET Request
export const redirectTo = (res: Response): any => {
  try {
    return res.redirect("http://localhost:5173");
  } catch (err) {
    // res.status(500).json({ message: "Internal server error", error: err });
    return ServerErrorResponse(res, err);
  }
};

// POST Request
export const createCourse = async (req: any, res: Response): Promise<any> => {
  try {
    const { courseName } = req.body;
    const newCourse = await Course.create({
      courseName,
    });

    if (newCourse) {
      return res.status(200).json({ message: "Cousrse Created Successfully!" });
    } else {
      return res.status(500).json({ message: "Cousrse Creation Failed!" });
    }
  } catch (err) {
    // res.status(500).json({message: "Something Went Wrong!"});
    return ServerErrorResponse(res, err);
  }
};

// POST Request
export const createModule = async (req: any, res: Response): Promise<any> => {
  try {
    const { moduleName, courseId } = req.body;
    const newModule = await Module.create({
      moduleName,
      courseId,
    });

    if (newModule) {
      return res.status(200).json({ message: "Module Created Successfully!" });
    } else {
      return res.status(500).json({ message: "Cousrse Creation Failed!" });
    }
  } catch (err) {
    return ServerErrorResponse(res, err);
  }
};

// POST Request  pending
export const addVideo = async (req: any, res: Response): Promise<any> => {
  try {
    console.log(req.file);
    const { originalname, mimetype, buffer } = req.file;
    // const {moduleId, sequence} = req.body;
    console.log(req.file);
    const module = "module1";
    const course = "course1";
    const key = `${course}/${module}/${originalname}`;
    const url = await generateUploadUrl(key, mimetype, buffer);
    // console.log(key);
    // const newVideo = await Video.create({
    //     videoName,
    //     moduleId,
    //     sequence
    // });

    // if(newVideo){
    //     return res.status(200).json({url: "", savedStatus: 1});
    // } else {
    //     return res.status(500).json({message: "Video uploading Failed!", savedStatus: 0});
    // }
    return res
      .status(200)
      .json({ message: "Video Uploaded Successfully", location: url });
  } catch (err) {
    return ServerErrorResponse(res, err);
  }
};

// GET Request
export const getAllCourses = async (req: any, res: Response): Promise<any> => {
  try {
    const { uuid } = req.user;
    const courses = await Course.findAll();
    if (courses.length > 0) {
      return res.status(200).json({ courses, message: "Courses fetched" });
    } else {
      return res
        .status(200)
        .json({ message: "Currently there is no any coures Existed! " });
    }
  } catch (err) {
    return ServerErrorResponse(res, err);
  }
};

// GET Request
export const getCourseModules = async (req: any, res: Response): Promise<any> => {
  try {
    const { uuid } = req.user;
    const { courseId } = req.query;
    const modules = await Module.findAll({ where: { courseId: courseId } });
    if (modules.length > 0) {
      return res.status(200).json({ modules, message: "Modules fetched" });
    } else {
      return res.status(200).json({
        message: "Currently, there is no any module Existed for this Course! ",
      });
    }
  } catch (err) {
    return ServerErrorResponse(res, err);
  }
};

// Get Request
export const getBulkVideoUrls = async (req: any, res: Response): Promise<any> => {
  // const { courseId, moduleId } = req.params;
  const moduleId = "module1";
  const courseId = "course1";
  const prefix = `${courseId}/${moduleId}/`;

  try {
    // List all .mp4 files inside the module
    const listCommand = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: prefix,
    });

    const listResponse = await s3.send(listCommand);

    if (!listResponse.Contents || listResponse.Contents.length === 0) {
      return res
        .status(404)
        .json({ message: "No videos found in this module" });
    }

    const videoUrls = await Promise.all(
      listResponse.Contents.map(async (item) => {
        if (!item.Key || !item.Key.endsWith(".mp4")) return null; // skip non-mp4 files

        const getCommand = new GetObjectCommand({
          Bucket: bucketName,
          Key: item.Key,
          ResponseContentType: "video/mp4", // Ensures it's streamed properly
        });

        const signedUrl = await getSignedUrl(s3, getCommand, {
          expiresIn: 3600,
        }); // 1 hour expiry

        return {
          fileName: item.Key.split("/").pop(), // just the filename like intro.mp4
          url: signedUrl,
        };
      })
    );

    // Filter out any nulls (non-mp4 files)
    const filteredVideos = videoUrls.filter(
      (v): v is { fileName: string; url: string } => v !== null
    );

    res.status(200).json({ videos: filteredVideos });
  } catch (error) {
    console.error("Error fetching video URLs:", error);
    return ServerErrorResponse(res, error);
  }
};

// Get Request  for Invoices
export const getPaymentLogs = async (req: any, res: Response): Promise<any> => {
  try {
    const paymentLogs = await courseSubscription.findAll({
      include: [
        {
          model: Course,
          as: "subscribedCourse",
        },
      ],
    });

    return res.status(200).json({ paymentLogs });
  } catch (err) {
    return ServerErrorResponse(res, err);
  }
};

// Get Request for dashboard
export const getStudentCourses = async (req: any, res: Response) => {
  try {
    const getStudentCourseaDetail = await courseSubscription.findAll({
      where: { isPaid: 1 },
      include: [
        {
          model: Course,
          as: "subscribedCourse",
        },
      ],
    });
    res.status(200).json({ getStudentCourseaDetail });
  } catch (err) {
    return ServerErrorResponse(res, err);
  }
};

// Get Request for student details
export const getStudentDetails = async (req: any, res: Response) => {
  try {
    const students = await Student.findAll();
    res.status(200).json({ students });
  } catch (err) {
    return ServerErrorResponse(res, err);
  }
};

// Post Request
export const addNotes = async (req: any, res: Response) => {
  try {
    const { uuid } = req.user;
    const { heading, description, type } = req.body;

    const newNote = await Notes.create({
      heading,
      description,
      type,
    });

    if (newNote) {
      res.status(200).json({ message: "Note created successfully" });
    } else {
      ServerErrorResponse(res, "Note creation Failed");
    }
  } catch (err: any) {
    ServerErrorResponse(res, err);
  }
};

// Get Request
export const getNotes = async (req: any, res: Response) => {
  try {
    const { uuid } = req.user;
    const { search } = req.query;

    const notes = await Notes.findAll({
      where: {
        [Op.and]: [
          {
            heading: {
              [Op.like]: `%${search}%`,
            }
          },
          {
            description: {
              [Op.like]: `%${search}%`,
            }
          }
        ]
      }
    });

    res.status(200).json({"message": "Notes Fetched", notes});
  } catch (err: any) {
    ServerErrorResponse(res, err);
  }
};
