import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Local } from "../environment/env";
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
import coursesRating from "../models/coursesRating";
import Students from "../models/student";
import { PDFDocument, grayscale, StandardFonts } from "pdf-lib";
import fs from "fs";
import path from "path";
import fileType from "file-type";
import studentCertificate from "../models/studentCertificate";

const Secret_key: any = Local.Secret_Key;
const bucketName: any = Local.S3_Bucket_Name;

// Error Response
const ServerErrorResponse = async (res: Response, err: any) => {
  await Video.findAll();
  return res.status(500).json({ message: `Something Went Wrong! ${err}  ` });
};

// POST Request
export const userLogin = async (req: any, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;
    const user = await Students.findOne({ where: { email: email } });
    if (!user) {
      return res.status(404).json({ message: "User doesn't exist" });
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
    const {
      email,
      password,
      FirstName,
      LastName,
      PhoneNo,
      Address,
      City,
      Age,
    } = req.body;
    const isExist = await Students.findOne({ where: { email: email } });
    if (!isExist) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await Students.create({
        email,
        password: hashedPassword,
        firstName: FirstName,
        lastName: LastName,
        phoneNo: PhoneNo,
        city: City,
        age: Age,
        address: Address,
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
export const redirectTo = (req: any, res: Response, next: NextFunction ): any => {
  try {
    console.log("------>", req.user);
    // return res.redirect("http://localhost:5173/student/dashboard");
    return res?.status(200).json({ message: "Login Successfully" });
  } catch (err) {
    // res.status(500).json({ message: "Internal server error", error: err });
    // console.log(err);
    return ServerErrorResponse(res, err);
  }
};

// POST Request
export const createCourse = async (req: any, res: Response): Promise<any> => {
  try {
    const {
      courseName,
      description,
      mentor,
      mentorDesignation,
      startAt,
      price,
    } = req.body;

    const isCourseExists = await Course.findOne({where:{courseName}});

    if(isCourseExists){
      return res.status(409).json({"message":"Course with this name alreaady Exists."});
    }

    const newCourse = await Course.create({
      courseName,
      description,
      mentor,
      mentorDesignation,
      startAt,
      price,
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

    const isCourseModuleExisted = await Module.findOne({where: {
      [Op.and]:[
        { moduleName },
        { courseId }
      ]}});

      if(isCourseModuleExisted){
        return res.status(409).json({"message": "Module with this name already existed in selected Course"});
      }

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
    const { videoName, moduleId, sequence } = req.body;
    
    const isVideoExist = await Video.findOne({where: {videoName}});

    if(isVideoExist){
      return res.status(409).json({"message":"Video Lecture with this name alreaady Exists "});
    }

    const module = await Module.findByPk(moduleId, {
      include: {
        model: Course,
        as: "courseModule",
      },
    });
    const courseId = module?.courseId;
    console.log(req.file);
    const moduleName = module?.moduleName;
    const courseName = module?.courseModule?.courseName;
    const key = `courses/${courseName}/${moduleName}/${originalname}`;
    const url = await generateUploadUrl(key, mimetype, buffer);
    // console.log(key);
    const newVideo = await Video.create({
      videoName,
      sequence,
      moduleId,
      courseId,
      awsS3Key: key,
    });

    if (newVideo) {
      return res
        .status(200)
        .json({
          message: "Video uploaded Successfully!",
          savedStatus: 1,
          location: url,
        });
    } else {
      return res
        .status(500)
        .json({ message: "Video uploading Failed!", savedStatus: 0 });
    }
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
export const getCourseDetail = async (req: any, res: Response): Promise<any> => {
  try{
    const {courseId} = req.query;
    const course = await Course.findByPk(courseId, {
      include:[
        {
          model: Module,
          as: "courseModule",
          include: [
            {
              model: Video,
              as: "module"
            }
          ]
        },
        {
          model: coursesRating,
          as: "ratedCourse"
        }
      ]
    });


    return res.status(200).json({"message": "Course Details Fetched", course});

  } catch(err:any){
    return ServerErrorResponse(res, err);
  }
}

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

// Get Request ⁡⁣⁣⁢Pending⁡ for video page
export const getStudentCourseVideos = async (req: any, res: Response): Promise<any> => {
  const { courseId } = req.query;

  let course:any = await Course.findByPk(courseId, {
    include:[
      {
        model: Module,
        as: 'courseModule'
      }
    ]
  });
  const courseName = course?.courseName;
  // const modifiedcourse = {...course, courseModule: course?.courseModule?.map((item:any)=>({...item, videolink:"testing", videoKey:"keytest"}))}
  // const courseId = "UI-UX Design Bootcamp";
  const prefix = `courses/${courseName}`;

  try {
    // List all .mp4 files inside the module

    const modifiedcourse = {
      ...course.toJSON(),
      courseModule: await Promise.all( course.courseModule.map(async(module:any) =>{
        const listCommand = new ListObjectsV2Command({
          Bucket: bucketName,
          Prefix: `${prefix}/${module?.dataValues.moduleName}/`,
        });

        const listResponse:any = await s3.send(listCommand);
        
        if (!listResponse.Contents || listResponse.Contents.length === 0) {
          return res
            .status(404)
            .json({ message: "No videos found in this module" });
        };

        const videoUrls = await Promise.all(
          listResponse.Contents.map(async (item:any) => {
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
              key: item.Key,
              fileName: item.Key.split("/").pop(), // just the filename like intro.mp4
              url: signedUrl,
            };
          })
        );

        const filteredVideoUrls = videoUrls.filter((v) => v !== null);

        return {
        ...module.dataValues,
        filteredVideoUrls
      }}))
    };
    
    

    return res.status(200).json(modifiedcourse);
    
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
export const getStudentCourses = async (req: any, res: Response): Promise<any> => {
  try {
    // const {uuid} = req.user;
    const getStudentCourseaDetail = await courseSubscription.findAll({
      where: { is_paid: 1, studentId: "bf4eebcd-b9a7-4509-99c3-b1c31d32f85e" },
      include: [
        {
          model: Course,
          as: "subscribedCourse",
          include: [
            {
              model: coursesRating,
              as: "ratedCourse",
            },
          ],
        },
      ],
    });
    res.status(200).json({ getStudentCourseaDetail });
  } catch (err) {
    return ServerErrorResponse(res, err);
  }
};

// Get Request for student details
export const getStudentDetails = async (req: any, res: Response): Promise<any> => {
  try {
    const students = await Students.findAll();
    res.status(200).json({ students });
  } catch (err) {
    return ServerErrorResponse(res, err);
  }
};

// Post Request
export const addNotes = async (req: any, res: Response): Promise<any> => {
  try {
    const { uuid } = req.user;
    const { heading, description, type } = req.body;

    const newNote = await Notes.create({
      heading,
      userId: uuid,
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
export const getUserNotes = async (req: any, res: Response): Promise<any> => {
  try {
    const { uuid } = req.user;
    const { search, noteType } = req.query;
    console.log("111");
    const notes = await Notes.findAll({
      where: {
        [Op.or]: [
          {
            heading: {
              [Op.like]: `%${search}%`,
            },
          },
          {
            description: {
              [Op.like]: `%${search}%`,
            },
          },
          {
            type: {
              [Op.like]: `%${noteType}%`,
            },
          },
        ],
        userId: uuid,
      },
    });

    res.status(200).json({ message: "Notes Fetched", notes });
  } catch (err: any) {
    ServerErrorResponse(res, err);
  }
};

// Put Request
export const updateStudentPassword = async (req: any, res: Response): Promise<any> => {
  try {
    const { uuid } = req.user;
    const { oldPassword, newPassword } = req.body;

    const student: any = Students.findByPk(uuid);

    const isMatch = await bcrypt.compare(oldPassword, student.password);
    if (isMatch) {
      const newStudentPassword = await bcrypt.hash(newPassword, 10);
      await student.update({
        password: newStudentPassword,
      });

      res.status(200).json({ message: "Password Updated Successfully" });
    } else {
      res.status(401).json({ message: "Current password is wrong" });
    }
  } catch (err) {
    ServerErrorResponse(res, err);
  }
};

// Delete Request
export const deleteStudent = async (req: any, res: Response): Promise<any> => {
  try {
    const { uuid } = req.user;
    const student = await Students.findByPk(uuid);
    await student?.destroy();

    res.status(200).json({ message: "Account deleted Successfully" });
  } catch (err) {
    ServerErrorResponse(res, err);
  }
};

// Put Request
export const updateStudentProfile = async (req: any, res: Response): Promise<any> => {
  try {
    const { uuid } = req.user;
    const { firstName, lastName, email, phoneNo, age, city, address } =
      req.body;
    const student = await Students.findByPk(uuid);

    const updatedStudent = await student?.update({
      firstName,
      lastName,
      email,
      phoneNo,
      age,
      city,
      address,
    });

    if (updatedStudent) {
      res.status(200).json({ message: "Profile Updated Successfully" });
    } else {
      res.status(500).json({ message: "Profile Updation Failed" });
    }
  } catch (err) {
    ServerErrorResponse(res, err);
  }
};

// Post Request ⁡⁣⁣⁢Pending⁡
export const generateCertificate = async (req: any, res: Response): Promise<any> => {
  try {
    // const {uuid} = req.user;
    // const {courseId} = req.body;

    const course = await Course.findByPk("63f9342f-9ab1-44ff-960c-649e19cc045c");
    const student = await Students.findByPk("5d6120be-495a-4ee4-9e6f-9a690fc25feb");

    const date = String(new Date()).split(" ");
    const stringDate = `${date[2]}-${date[1]}-${date[3]}`;

    const imagePath = path.join(__dirname, 'cert.jpeg');
    const imageBytes = fs.readFileSync(imagePath);
    const type = await fileType.fromBuffer(imageBytes);

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([1086, 768]);

    let embeddedImage;
    if (type?.mime === 'image/png') {
      embeddedImage = await pdfDoc.embedPng(imageBytes);
    } else if (type?.mime === 'image/jpeg') {
      embeddedImage = await pdfDoc.embedJpg(imageBytes);
    } else {
      throw new Error('Unsupported image format. Please use PNG or JPEG.');
    }

    page.drawImage(embeddedImage, { x: 0, y: 0, width: 1086, height: 768 });

    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    page.drawText(`${student?.firstName} ${student?.lastName}`||"", {
      x: 378,
      y: 379,
      size: 20,
      font,
      color: grayscale(1)
    });

    page.drawText(course?.courseName||"", {
      x: 236,
      y: 346,
      size: 16,
      font,
      color: grayscale(1),
    });

    page.drawText(stringDate, {
      x: 240,
      y: 278,
      size: 16,
      font,
      color: grayscale(1),
    });

    const pdfBytes = await pdfDoc.save();

    const fileKey = `certificates/${student?.firstName}_${student?.lastName}_${student?.uuid}/${course?.courseName}_${course?.uuid}.pdf`;

    const uploadResult = await generateUploadUrl(fileKey, 'application/pdf', Buffer.from(pdfBytes));

    if(uploadResult){
      const newCertificate = await studentCertificate.create({
        studentId: student?.uuid,
        courseId: course?.uuid,
        key: fileKey
      });

      if(newCertificate){
        return res.status(200).json({message: 'Certificate generated and uploaded to S3 successfully', uploadDetails: uploadResult});
      } else {
        return res.status(500).json({message: 'Certificate generated and uploaded to DB Failed'});
      }
    } else {
      return res.status(500).json({message: 'Certificate generated and uploaded to S3 successfully'});
    }

  } catch (err) {
    ServerErrorResponse(res, err);
  }
};

// Get Request
export const getCertificate = async (req: any, res: Response): Promise<any> => {
  try {
    // const {uuid} = req.user;
    const student = await Students.findByPk("5d6120be-495a-4ee4-9e6f-9a690fc25feb");
    const prefix = `certificates/${student?.firstName}_${student?.lastName}_${student?.uuid}/`;

    const listCommand = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: prefix,
    });

    const listResponse = await s3.send(listCommand);

    if (!listResponse.Contents || listResponse.Contents.length === 0) {
      return res
        .status(404)
        .json({ message: "No Certificate found for this user" });
    }

    const certificateUrls = await Promise.all(
      listResponse.Contents.map(async (item) => {
        if (!item.Key || !item.Key.endsWith(".pdf")) return null; // skip non-mp4 files

        const getCommand = new GetObjectCommand({
          Bucket: bucketName,
          Key: item.Key,
          ResponseContentType: "pdf", // Ensures it's streamed properly
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
    const filteredCertificate = certificateUrls.filter(
      (v): v is { fileName: string; url: string } => v !== null
    );

    res.status(200).json({ "certificates": filteredCertificate });
  } catch (err) {
    ServerErrorResponse(res, err);
  }
};

// Post Request ⁡⁣⁣⁢Pending⁡
export const createCertificate = async(req: any, res: Response): Promise<any> => {
  try{

  } catch(err){
    ServerErrorResponse(res, err);
  }
};
