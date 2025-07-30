import { checkConnection } from "@/data/db";
import logger from "@/services/logger";
import { EndpointReturn } from "@/types/endpointReturn";
import { Request, Response } from "express";

const handleRoute = <T = any>(
    handler: (req: any, res: any) => Promise<EndpointReturn<T>> | EndpointReturn<T> // async veya sync endpointlere izin veriliyor.
) => {
    return async (req: Request, res: Response) => {
        try {
            console.log(`İstek geldi (${new Intl.DateTimeFormat('tr-TR').format(new Date()).replace(/\./g, "/")} ${new Date().toLocaleTimeString('tr-TR', { hour12: false })}): ${req.originalUrl}`);

            if (!req.user) {
                if (!req.isSessional) {
                    // İsteğe kullanıcı bilgisi eklenmemiş fakat oturum gerektirmeyen bir endpointe giriyorsa sahte kullanıcı yazılacak:
                    req.user = {
                        id: "",
                        email: "",
                        password: "",
                        isActive: false,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    };
                } else {
                    logger.critical("İstek oturum katmanından geçmiş fakat kullanıcı bilgileri yazılmamış!", 27);
                    res.status(500).send({
                        message: "Bir sorun oluştu! Lütfen tekrar oturum açın."
                    });
                    return;
                }
            }

            // İstek gerekli endpointe iletiliyor: (handler = endpoint fonksiyonu)
            const result = await handler(req, res);

            if (result.error && result.error.length > 0) {
                res.status(result.statusCode < 400 ? 500 : result.statusCode).send({
                    message: result.error
                });

            } else {
                res.status(result.statusCode).send({
                    ...result.data
                });
            }
            return;

        } catch (error) { // errorCatcher
            const messsage = "Sistemde bir sorun oluştu: " + (error instanceof Error ? error.message : "Hata tespit edilemedi!");

            if (await checkConnection()) {
                logger.error(messsage, 31);
            } else {
                console.error(messsage);
            }

            res.status(500).send({
                error: "Bilinmeyen bir sorun oluştu!"
            });
            return;
        }
    }
}

export default handleRoute;
