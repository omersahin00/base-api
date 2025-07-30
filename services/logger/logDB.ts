import { Log } from "@/models";
import { database } from "@/config";

const logDB = async (message: string, code: number, level: string): Promise<boolean> => {
    try {
        if (database.access === "false") return true;

        await Log.create({
            level,
            code,
            message,
            timestamp: new Date()
        });

        return true;

    } catch (error) {
        if (error instanceof Error) {
            console.error("Log mesajı veritabanına yazılırken hata gerçekleşti:", error.message);
        } else {
            console.error("Log mesajı veritabanına yazılırken hata gerçekleşti.")
        }
        return false;
    }
};

export default logDB;
