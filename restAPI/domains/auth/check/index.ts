import { Request, Response } from "express";
import { EndpointReturn } from "@/types/endpointReturn";
import jwt from "jsonwebtoken";
import logger from "@/services/logger";
import { token as tokenConfig } from "@config/index";

export interface LoginCheckResponse {
    status: boolean;
    message: string;
    usingMinutes?: number;
    refreshPeriodMinute?: number;
}

const loginCheck = async (
    req: Request,
    res: Response<LoginCheckResponse>
): Promise<EndpointReturn<LoginCheckResponse>> => {

    const user = req.user;
    const token = req.token;

    if (!user || !token) {
        return {
            statusCode: 401,
            data: {
                status: false,
                message: "Oturum açılmamış!"
            }
        }
    } else {

        let usingMinutes: number = 0;
        try {
            const decoded: any = jwt.decode(token);
            if (decoded && decoded.exp) {
                const now = Math.floor(Date.now() / 1000);
                const expiresIn = decoded.exp - now; // kaç saniye sonra geçersiz kalacak.
                const expiresInMinutes = Math.floor(expiresIn / 60); // kaç dakika sonra geçersiz kalacak.
                usingMinutes = (Number(tokenConfig.expirationDate.number) * 60) - expiresInMinutes; // kaç dakika kullanılmış.
            } else {
                logger.critical(`Token'a kullanım süresi eklenmemiş! Token sahibi userId:[${user.id}]`, 26);
                throw new Error();
            }
        } catch (error) {
            return {
                statusCode: 401,
                data: {
                    status: false,
                    message: "Oturum süresi doğrulanamadı!"
                }
            }
        }

        const refreshPeriod = Number(tokenConfig.refreshPeriodMinute);

        return {
            statusCode: 200,
            data: {
                status: true,
                message: "Oturum doğrulandı.",
                usingMinutes: usingMinutes,
                refreshPeriodMinute: refreshPeriod
            }
        }
    }
};

export default loginCheck;
