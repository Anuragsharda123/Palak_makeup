import {Model, DataTypes} from "sequelize";
import sequelize from "../config/db";
import { v4 as UUIDV4 } from "uuid";
import { ENUM } from "sequelize";

class Course extends Model {
    public uuid!: string;
    public courseName!: string;
    public courseImg!: string;
    public description!: string;
    public mentor!: string;
    public mentorDesignation!: string;
    public startAt!: Date;
    public price!: number;
    public rating!: number;
    public ratingCount!: number;
    public ratingLevel!: number;
};


Course.init({
    uuid:{
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    courseName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    courseImg:{
        type: DataTypes.STRING,
        // allowNull: true,
        // unique: true
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    mentor: {
        type: DataTypes.STRING,
        allowNull: false
    },
    mentorDesignation: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    rating: {
        type: DataTypes.DECIMAL(10, 2),
    },
    ratingCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    ratingLevel: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    startAt:{
        type: DataTypes.DATEONLY,
        allowNull: false
    }
},{
    sequelize,
    modelName: 'Courses',
    timestamps: true,
    paranoid: true
})

export default Course;