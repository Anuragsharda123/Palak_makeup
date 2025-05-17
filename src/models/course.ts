import {Model, DataTypes} from "sequelize";
import sequelize from "../config/db";
import { v4 as UUIDV4 } from "uuid";

class Course extends Model {
    public uuid!: string;
    public courseName!: string;
    public description!: string;
    public mentor!: string;
    public mentorDesignation!: string;
    public price!: number;
    public rating!: number;
    public ratingCount!: number
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
    }
},{
    sequelize,
    modelName: 'Users',
    timestamps: true,
    paranoid: true
})

export default Course;