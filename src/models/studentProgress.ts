import sequelize from "../config/db";
import { DataTypes, Model } from "sequelize";
import { v4 as UUIDV4 } from "uuid";
import Course from "./course";
import Video from "./video";
import User from "./user";

class studentProgress extends Model{
    public uuid!: string;
    public studentId!: string;
    public videoId!: string;
    public progess!: number;
    public iscompleted!: boolean;
}

studentProgress.init({
    uuid:{
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    progress:{
        type: DataTypes.DECIMAL,
        defaultValue: 0
    },
    isCompleted:{
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
},{
    sequelize,
    modelName: "student_progress",
    paranoid: true,
    timestamps: true
});

Video.hasMany(studentProgress, { foreignKey:"videoId", onDelete: "CASCADE", onUpdate: "CASCADE", as: "progressVideo" });
studentProgress.belongsTo(Video, { foreignKey:"videoId", onDelete: "CASCADE", onUpdate:"CASCADE", as:"progressVideo"});

User.hasMany(studentProgress, { foreignKey:"studentId", onDelete: "CASCADE", onUpdate:"CASCADE", as:"progressUser"});
studentProgress.belongsTo(User, { foreignKey:"studentId", onDelete: "CASCADE", onUpdate:"CASCADE", as:"progressUser"});


export default studentProgress;