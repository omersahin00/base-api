import { environment } from "@/config";
import logger from "@/services/logger";

const Schedulers = () => {
    if (environment === "production") {
        logger.info("Zamana duyarlı servisler başlatıldı.", 9);

        require("./cleanOldLogs");
    };
};

export default Schedulers;
