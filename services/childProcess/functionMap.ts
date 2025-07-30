// Child Process'lerde sadece bir fonksiyon çalıştırılacağı için import'lar işlem içerisinde yapıldı.

interface FunctionMapType {
    [key: string]: {
        environment: Record<string, any>;
        execute: (...args: any[]) => any;
    }
}

// Child Process olarak çalıştırılacak olan fonksiyonların listesi, aldığı argümanlar burada belirtilmektedir:
const functionMap: FunctionMapType = {
    cleanOldLogs: {
        environment: {
            DATABASE_ACCESS: true
        },
        execute: async () => {
            const cleanOldLogs = await import("../../schedulers/cleanOldLogs/process");
            return await cleanOldLogs.default();
        }
    },
};

export default functionMap;
