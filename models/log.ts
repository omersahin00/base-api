import { sequelize } from "@/data/db";
import { DataTypes, Model } from "sequelize";

export interface LogAttributes {
    id?: string;
    code: number;
    level: string;
    message: string;
    timestamp: Date;
}

export interface LogInstance extends Model<LogAttributes>, LogAttributes {}

const Log = sequelize.define<LogInstance>("logs", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    code: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    level: {
        type: DataTypes.STRING,
        allowNull: false
    },
    message: {
        type: DataTypes.STRING,
        allowNull: false
    },
    timestamp: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, { timestamps: false });

export default Log;
