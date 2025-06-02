import {Model, DataTypes} from "sequelize";
import sequelize from "../config/db";
import { v4 as UUIDV4 } from "uuid";
import Course from "./course";
import Students from "./student";

class coursesRating extends Model {
    public uuid!: string;
    public ratingBy!: string;
    public courseId!: string;
    public ratingLevel!: number;
};

coursesRating.init({
    uuid:{
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    ratingLevel: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    }
},{
    sequelize,
    modelName: 'course_rating',
    timestamps: true,
    paranoid: true
})

Course.hasMany(coursesRating, { foreignKey: 'courseId', as: "ratedCourse", onDelete:"CASCADE", onUpdate: "CASCADE" });
coursesRating.hasMany(Course, { foreignKey: 'courseId', as: "ratedCourse", onDelete:"CASCADE", onUpdate: "CASCADE" });

Students.hasMany(coursesRating, { foreignKey: 'ratingBy', as: "ratingStudent", onDelete:"CASCADE", onUpdate: "CASCADE" });
coursesRating.hasMany(Students, { foreignKey: 'ratingBy', as: "ratingStudent", onDelete:"CASCADE", onUpdate: "CASCADE" });

export default coursesRating;