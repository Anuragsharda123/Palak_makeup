import { Sequelize } from "sequelize";
import { Local } from "../environment/env";

const DIA:any = Local.DB_Dialect;

const sequelize = new Sequelize( Local.Conn_URL, {
  dialect: DIA,
  logging: false
});

export default sequelize;