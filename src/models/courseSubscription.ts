import sequelize from "../config/db";
import { DataTypes, Model } from "sequelize";
import { v4 as UUIDV4 } from "uuid";
import Course from "./course";
import User from "./student";

class courseSubscription extends Model{
    public uuid!: string;
    public studentId!: string;
    public courseId!: string;
    public isPaid!: boolean;
    public isCompleted!: boolean;
}

courseSubscription.init({
    uuid:{
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    is_paid:{
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    is_completed:{
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
},{
    sequelize,
    modelName: "course_subscription",
    paranoid: true,
    timestamps: true
});

Course.hasMany(courseSubscription, { foreignKey:"courseId", onDelete: "CASCADE", onUpdate:"CASCADE", as:"subscribedCourse"});
courseSubscription.belongsTo(Course, { foreignKey:"courseId", onDelete: "CASCADE", onUpdate:"CASCADE", as:"subscribedCourse"});

User.hasMany(courseSubscription, { foreignKey:"studentId", onDelete: "CASCADE", onUpdate:"CASCADE", as:"subscribedUser"});
courseSubscription.belongsTo(User, { foreignKey:"studentId", onDelete: "CASCADE", onUpdate:"CASCADE", as:"subscribedUser"});

export default courseSubscription;