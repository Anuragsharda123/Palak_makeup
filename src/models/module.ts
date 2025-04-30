import {Model, DataTypes} from "sequelize";
import sequelize from "../config/db";
import { v4 as UUIDV4 } from "uuid";
import Course from "./course";

class Module extends Model {
    public uuid!: string
    public moduleName!: string
    public courseId!: string
};

Module.init({
    uuid:{
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    modelName: {
        type: DataTypes.STRING,
        allowNull: false
    }
},{
    sequelize,
    modelName: 'Users',
    timestamps: true,
    paranoid: true
});

Course.hasMany(Module, {foreignKey: "courseId", onDelete: "CASCADE", onUpdate: "CASCADE", as: "course"});
Module.belongsTo(Course, {foreignKey: "courseId", onDelete: "CASCADE", onUpdate: "CASCADE", as: "course"});

export default Module;