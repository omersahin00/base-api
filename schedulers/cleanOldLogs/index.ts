import nodeCron from "node-cron";
import childProcess from "@/services/childProcess";
import { automaticSystemsRunHour as runTime } from "@config/index";
import logger from "@/services/logger";

// Her hafta gece saat <runTime>'da otomatik olarak çalışmaktadır:

// Her hafta 1 kere çalışarak, eski log'ların temizlenmesini sağlar:
nodeCron.schedule(`0 ${runTime} * * 1`, async () => {
    logger.info("Zamana duyarlı Log temizleme işlemi başlatıldı.", 9);

    childProcess("cleanOldLogs");
});
