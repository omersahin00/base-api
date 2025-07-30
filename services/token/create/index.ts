import { Token } from "@/models";
import jwt from "jsonwebtoken";
import { token as tokenConfig } from "@/config";
import logger from "@/services/logger";

interface tokenCreateAttributes {
    userId: string;
    email: string;
    isLong?: boolean;
}

interface tokenCreateReturn {
    status: boolean;
    message: string;
    token?: string;
}

export interface tokenPayload {
    email: string;
    isLong: boolean;
}

const tokenCreate = async (params: tokenCreateAttributes): Promise<tokenCreateReturn> => {
    if (!params.isLong) { // undefined & null koruması.
        params.isLong = false;
    }

    const payload: tokenPayload = {
        email: params.email,
        isLong: params.isLong
    }

    // Token üretiliyor:
    const newToken = jwt.sign(
        payload,
        tokenConfig.JWT_KEY,
        {
            expiresIn: (
                params.isLong
                    ? tokenConfig.longExpirationDate.string
                    : tokenConfig.expirationDate.string
            ) as any
            // Not: any yapmak zorunluydu hiçbir string ifadeyi kabul etmiyor.
        }
    );

    if (!newToken) {
        return {
            status: false,
            message: "Oturum açılırken bir hata oluştu."
        }
    }

    // Token sadece long ise veritabanına yazılacak:
    if (params.isLong) {
        try {
            await Token.create({
                userId: params.userId,
                token: newToken
            });

        } catch (error) {
            logger.critical("Kritik hata: LongToken veritabanına yazılamadı!", 29);

            return {
                status: false,
                message: "Oturum açılırken bir hata oluştu!"
            }
        }
    }

    return {
        status: true,
        message: "Oturum açıldı.",
        token: newToken
    }
}

export default tokenCreate;
