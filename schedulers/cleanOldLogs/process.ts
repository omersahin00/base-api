import { Log } from "@/models";
import { Op } from "sequelize";
import { logStoragePeriod } from "@/config";
import logger from "@/services/logger";
import { ChildProcessResult } from "@/services/childProcess";

// CHILDPROCESS
const cleanOldLogs = async (): Promise<ChildProcessResult> => {
    const period = Number(logStoragePeriod);

    try {
        await Log.destroy({
            where: {
                timestamp: {
                    [Op.lt]: new Date(Date.now() - period * 30 * 24 * 60 * 60 * 1000) // <period> ay önceki log'lar siliniyor.
                }
            }
        });

    } catch (error) {
        let message;
        if (error instanceof Error) {
            logger.error(error.message, 9);
            message = error.message;
        } else {
            message = "Otomatik Log temizleme sistemi bilinmeyen bir hata ile sonlandı!";
            logger.error(message, 9);
        }
        return {
            status: false,
            message: message
        }
    }

    const message = `${period} ay önceki Log'lar veritabanından temizlendi.`;

    logger.info(message, 3);

    return {
        status: true,
        message: message
    }
};

export default cleanOldLogs;
