import {Model, DataTypes} from "sequelize";
import sequelize from "../config/db";
import { v4 as UUIDV4 } from "uuid";

class Admin extends Model{
    public uuid!: string;
    public name!: string;
    public email!: string;
    public adminType!: string;  // 2 is for Admin & 3 is for SuperAdmin
    public password!: string;
};

Admin.init({
    uuid:{
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    adminType: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 2
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Admin',
    timestamps: true,
    paranoid: true
});

export default Admin;