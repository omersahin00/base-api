import { token as tokenConfig } from "@/config";
import tokenControl from "@/services/token/control";
import { NextFunction, Request, Response } from "express";

interface isAuthForRestAttributes {
    message: string;
};

const isAuthForRest = async (
    req: Request,
    res: Response<isAuthForRestAttributes>,
    next: NextFunction
) => {

    req.isSessional = false;

    // 2 farklı alandan gönderilen token'lar kabul ediliyor:
    let token: string = "";
    if (tokenConfig.source === "headers") {
        token = req.headers.authorization ?? "";
    } else if (tokenConfig.source === "cookies") {
        token = req.cookies.token ?? "";
    }

    if (!token || token.length === 0) {
        res.status(401).send({
            message: "Lütfen oturum açın."
        });
        return;
    }

    const result = await tokenControl(token, false);

    if (!result.status || !result.user) {
        res.status(401).send({
            message: "Oturum doğrulanamadı!"
        });
        return;
    }

    req.user = result.user;
    req.token = token; // Token'a kolay ulaşmak için ekleniyor.
    req.isSessional = true;

    next();
};

export default isAuthForRest;
