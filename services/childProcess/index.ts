import { fork } from "child_process";
import logger from "../logger";
import functionMap from "./functionMap";
import path from "path";
import { existsSync } from "fs";

// ChildProcess olarak çalışacak olan işlemin döneceği tip:
export interface ChildProcessResult {   // Arka plan işlemi olarak çalışacağından, childProcess'de çalışan fonksiyon herhangi bir veri gönderdiğinde onu alacak bir sistem kurgulanmadı.
    status: boolean;                    // Yani childProcess işlemleri başka bir taska yardım etmek için değil tek başına bir task tamamlamak üzerine çalışıyor.
    message?: string;
}

const childProcess = (functionName: string, args: any[] = []) => {

    //======================================================================================================
    // Bu sistem bir alt işlem oluşturduğundan tekrar veri tabanı bağlantısı sağlamaması adına
    // oluşturulacak olan alt işlem için environment değişkenleri uygulanıyor:
    
    const environment = functionMap[functionName]?.environment;

    // Eğer build almadan ts olarak çalıştırılır ise ts dosyası, eğer build alınır ve js olarak çalıştırılır ise dist dizinindeki dosya kullanılacak:
    let processPath = path.join(process.cwd(), "dist", "services", "childProcess", "process.js");
    if (!existsSync(processPath)) {
        processPath = path.join(process.cwd(), "services", "childProcess", "process.ts");
    }

    const transactionHandler = fork(processPath, [], {
        env: { ...process.env, ...environment, PROCESS_IS_CHILD: "true" }
    });
    //======================================================================================================

    transactionHandler.send({
        functionName: functionName,
        args: args
    });

    functionName = functionName.charAt(0).toUpperCase() + functionName.slice(1);

    const messageHandler = (result: ChildProcessResult) => {
        if (result.status === true) {
            logger.info(`[${functionName}] işlemi tamamlandı: ${result.message ?? "Cevap dönmedi."}`, 10);
        }
        else {
            if (result.message && result.message.length > 0) {
                logger.error(`[${functionName}] işlemi tamamlanırken bir hata oluştu: ${result.message}`, 10);
            }
            else {
                logger.critical(`[${functionName}] işlemi tamamlanamadı.`, 10);    
            }
        }

        transactionHandler.off("message", messageHandler);
        transactionHandler.kill();
    };

    transactionHandler.on("message", messageHandler);
};

export default childProcess;
