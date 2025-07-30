import { sequelize } from "@/data/db";
import { DataTypes, Model } from "sequelize";

export interface TokenAttributes {
    id?: string;
    userId: string;
    token: string;
    createdAt?: Date;
}

export interface TokenInstance extends Model<TokenAttributes>, TokenAttributes {}

const Token = sequelize.define<TokenInstance>("tokens", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false
    } 
}, { timestamps: true, updatedAt: false });

export default Token;
