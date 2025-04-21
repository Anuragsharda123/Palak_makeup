import { Response } from "express";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Local } from "../environment/env";

const Secret_key:any = Local.Secret_Key
export const userLogin = async(req:any, res:Response):Promise<any> => {
    try{
        const { username, password } = req.body;
        // const user = await User.findOne({ username });
        if(username == 'Robo' && password == 'robo@123'){
            const token = jwt.sign({ username }, Secret_key);
            res.status(200).json({"message": 'Login Successfull', "token":token});
        } else {
            res.status(401).json({"message": 'Invalid username or password'});
        }
    } catch(err){
        res.status(500).json({ message: "Internal server error", error: err });
    }
};
