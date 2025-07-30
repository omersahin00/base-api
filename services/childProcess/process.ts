import functionMap from "./functionMap";

process.on("message", async ({ functionName, args }) => {
    try {
        const processFunction = functionMap[functionName];

        if (processFunction) {
            const result = await processFunction.execute(...args);
            if (typeof process.send === "function") {
                process.send({
                    status: result.status,
                    message: result.message,
                    error: result.error
                });
            }
        }
        else {
            throw new Error(`${functionName} isimli fonksiyon alt işlem için mevcut değil!`);
        }
    }
    catch (error) {
        if (typeof process.send === "function") {
            process.send({
                status: false,
                message: typeof error === "object" && error !== null && "message" in error ? error.message : "Bilinmeyen hata",
                error: error
            });
        }
    }
    finally {
        process.exit();
    };
});
