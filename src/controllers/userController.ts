import { Response } from "express";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Local } from "../environment/env";
import User from "../models/user";

const Secret_key:any = Local.Secret_Key
export const userLogin = async(req:any, res:Response):Promise<any> => {
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
                const token = jwt.sign({ id: user.uuid }, Secret_key, );
                return res.status(200).json({ "message":"Login successful" ,token });
            }
        }
    } catch(err){
        res.status(500).json({ message: "Internal server error", error: err });
    }
};

export const userRegister = async (req: any, res: Response): Promise<any> => {
    try{
        const { email, password } = req.body;
        const isExist = await User.findOne({where: {email : email}});
        if(!isExist){
            const hashedPassword = await bcrypt.hash(password, 10);
            await User.create({ email, password: hashedPassword });
            res.status(201).json({"message": 'User registered successfully'});
        } else {
            res.status(409).json({"message": 'User already exists'});
        }
    } catch(err){
        res.status(500).json({ message: "Internal server error", error: err });
    }
};
