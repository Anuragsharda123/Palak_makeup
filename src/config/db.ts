import { Sequelize } from "sequelize";
import { Local } from "../environment/env";

const DB:any = Local.DB_Name
const USER:any = Local.DB_User
const PASS:any = Local.DB_Password
const HOST:any = Local.DB_Host
const DIA:any = Local.DB_Dialect


const sequelize = new Sequelize(DB, USER, PASS, {
  host: HOST,
  dialect: DIA,
});

export default sequelize;