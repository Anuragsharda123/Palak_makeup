import {Model, DataTypes} from "sequelize";
import sequelize from "../config/db";
import { v4 as UUIDV4 } from "uuid";
import Module from "./module";

class Video extends Model {
    public uuid!: string;
    public videoName!: string;
    public awsS3Key!: string;
    public sequence!: number;
    public moduleId!: string;
};

Video.init({
    uuid:{
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    videoName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    awsS3Key:{
        type: DataTypes.STRING,
        allowNull: false
    },
    sequence: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
},{
    sequelize,
    modelName: 'Users',
    timestamps: true,
    paranoid: true
});

Module.hasMany(Video, {foreignKey: "moduleId", onDelete: "CASCADE", onUpdate: "CASCADE", as: "module"});
Video.belongsTo(Module, {foreignKey: "moduleId", onDelete: "CASCADE", onUpdate: "CASCADE", as: "module"});

export default Video;