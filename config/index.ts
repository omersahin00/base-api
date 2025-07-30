import dotenv from "dotenv";
import { Dialect } from "sequelize";

dotenv.config();

const config = {
    environment: process.env.NODE_ENV || "production",
    port: process.env.PORT || 4000,

    database: {
        host: process.env.DB_HOST || "localhost",
        port: process.env.DB_PORT || 1433,
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "",
        database: process.env.DB_DATABASE || "baseApiDb",
        dialect: "mysql" as Dialect,
        storage: "./session.mysql"
    },

    token: {
        JWT_KEY: process.env.JWT_KEY as string,
        expirationDate: { // saat cinsinden
            string: `${process.env.TOKEN_EXP_HOUR?.toString() || "4"}h`,
            number: process.env.TOKEN_EXP_HOUR && !isNaN(Number(process.env.TOKEN_EXP_HOUR))
                ? process.env.TOKEN_EXP_HOUR
                : "4"
        },
        longExpirationDate: { // gün cinsinden
            string: `${process.env.TOKEN_EXP_DAY?.toString() || "7"}d`,
            number: process.env.TOKEN_EXP_DAY && !isNaN(Number(process.env.TOKEN_EXP_DAY))
                ? process.env.TOKEN_EXP_DAY
                : "7"
        },
        source: process.env.TOKEN_SOURCE || "headers", // headers || cookies
        refreshPeriodMinute: process.env.TOKEN_REFRESH_PERIOD || "60" // Token'ın ne kadar sürede bir yenileneceğinin kaydı.
    },

    bcrypt: {
        saltRounds: process.env.BCRYPT_SALT_ROUNDS && !isNaN(Number(process.env.BCRYPT_SALT_ROUNDS))
            ? Number(process.env.BCRYPT_SALT_ROUNDS)
            : 12
    },

    // Zamana duyarlı çalışan sistemlerin çalıştırılma saati: (0-23 arasında olmalıdır)
    automaticSystemsRunHour: process.env.AUTOMATIC_SYSTEM_RUN_HOUR || "4",

    // (Month) Log'ların veritabanında kaç ay saklanacağını belirtir:
    logStoragePeriod: process.env.LOG_STORAGE_PERIOD || "3",
}

export default config;
export const { environment, port, database, token, bcrypt, automaticSystemsRunHour, logStoragePeriod } = config;
