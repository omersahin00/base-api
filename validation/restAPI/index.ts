import { NextFunction, Request, Response } from "express";
import logger from "@/services/logger";
// Validations:
import loginValidate from "@validation/restAPI/auth/login";
import registerValidate from "@validation/restAPI/auth/register";
import refreshTokenValidate from "@validation/restAPI/auth/refresh";

export const validations = {
    auth: {
        login: loginValidate,
        register: registerValidate,
        refresh: refreshTokenValidate,
    },
};

export const validator = (req: Request, res: Response, next: NextFunction) => {
    
    const urlPath = req.path;

    // Ana dizine istek hiçbir şekilde kabul edilmeyecek: (validasyon sistemini bozuyor)
    if (urlPath === "" || urlPath === "/") {
        res.status(403).send({
            message: "Bu rotaya yetkiniz bulunmamaktadır!"
        });
        return;
    }

    const pathSegments = urlPath.split("/").filter(seg => seg !== "");

    let currentLevel: any = validations;

    for (const segment of pathSegments) {
        if (currentLevel && currentLevel[segment]) {
            currentLevel = currentLevel[segment];
        } else {
            // Validasyon mevcut değil.
            next();
            return;
        }
    }

    if (typeof currentLevel === "function") {
        // req.body undefined ise boş obje kullan
        const dataToValidate = req.body || {};
        const result = currentLevel(dataToValidate);

        if (result.error) {
            // JOI HATA YAKALADI:
            res.status(400).send({
                message: result.error.details[0].message
            });
            return;
        } else {
            // HERHANGI BİR HATA YOK:
            next();
            return;
        }
    } else {
        // Bulunan şey fonksiyon değil:
        logger.critical(`Validasyon sisteminde ciddi hata: JOI validasyon fonksiyonu beklenirken, gelen şey fonksiyon türünde değil! Gelen veri:${currentLevel} Tipi: ${typeof currentLevel}`, 25);

        res.status(500).send({
            error: "Bilinmeyen bir sorun oluştu!"
        });
        return;
    }
};
