import {Model, DataTypes} from "sequelize";
import sequelize from "../config/db";
import { v4 as UUIDV4 } from "uuid";
import User from "./student";

class Notes extends Model{
    public uuid!: number;
    public heading!: number;
    public description!: number;
    public type!: number;
};


Notes.init({
    uuid:{
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    heading:{
        type: DataTypes.STRING,
        allowNull: false
    },
    description:{
        type: DataTypes.STRING,
        allowNull: false
    },
    type:{
        type: DataTypes.INTEGER,
        allowNull: false
    }
},{
    sequelize,
    modelName: "Note",
    timestamps: true,
    paranoid: true
});

User.hasMany(Notes, { foreignKey: 'userId', as: 'user', onDelete: "CASCADE", onUpdate: "CASCADE" });
Notes.belongsTo(User, {foreignKey: "userId", as: "user", onDelete: "CASCADE", onUpdate: "CASCADE"});

export default Notes;