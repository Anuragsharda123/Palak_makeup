// src/middleware/auth.ts
import {NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Local } from '../environment/env';

const secret = Local.Secret_Key;

export const authenticateJWT = (req: any, res: any, next: NextFunction) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Bearer token
  console.log(token)

  if (!token) return res.sendStatus(403);

  jwt.verify(token, secret|| '', (err:any, user:any) => {
    // console.log("user",user)
    if (err){
      console.log("Jwt ki taraf aaja bhai....")
      return res.status(403).json({ message: "UnAuthorized Access" });
    } 

    // (req as any).user = retailer;
    req.user = user;
    next();
  });
};
