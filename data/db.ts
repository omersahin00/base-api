import { Sequelize } from "sequelize";
import { database as db } from "../config";

const sequelize = new Sequelize(db.database, db.user, db.password, {
    host: db.host,
    dialect: db.dialect,
    define: {
        timestamps: true
    },
    storage: db.storage,
    logging: false
});

const connect = async (): Promise<{message: string, result: boolean}> => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();

        // Burada logger kullanılamamakta:
        console.log(`${db.dialect} Server (${db.host}) connection was established.`);
        
        return {
            message: "Database connection was established.",
            result: true
        }
    } catch (error) {
        console.error("Connection loss: ", error);
        return {
            message: "Database connection loss!",
            result: false
        }
    }
};

const checkConnection = async (): Promise<boolean> => {
    try {
        await sequelize.authenticate();
        return true;

    } catch (error) {
        return false;
    }
};

(async () => {
    if (!(process.env.DATABASE_ACCESS === "false")) { // Alt işlem parçalarının veri tabanına bağlanması engellendi.
        if (await checkConnection()) {
            await connect();
        } else {
            console.error("Kritik hata:", "Veritabanına bağlanılamadı!");
        }
    }
})();

export {
    sequelize,
    connect,
    checkConnection
};
