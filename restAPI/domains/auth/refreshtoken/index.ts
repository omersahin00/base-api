import { Token } from "@/models";
import logger from "@/services/logger";
import tokenControl from "@/services/token/control";
import tokenCreate from "@/services/token/create";
import { EndpointReturn } from "@/types/endpointReturn";
import { Request, response, Response } from "express";

export interface RefreshTokenRequest {
    longToken: string;
}

export interface RefreshTokenResponse {
    message: string;
    token?: string;
}

const refreshToken = async (
    req: Request<{}, any, RefreshTokenRequest>,
    res: Response<RefreshTokenResponse>
): Promise<EndpointReturn<RefreshTokenResponse>> => {

    const longToken = req.body.longToken;

    // LongToken doğrulanıyor:
    const controlResult = await tokenControl(longToken, true);

    if (!controlResult.status || !controlResult.user) {
        return {
            statusCode: 401,
            data: {
                message: "Oturum doğrulanamadı!"
            }
        }
    }

    // Yeni token üretiliyor:
    const tokenResult = await tokenCreate({ userId: controlResult.user.id, email: controlResult.user.email, isLong: false });

    if (!tokenResult.status || !tokenResult.token || tokenResult.token.length === 0) {
        return {
            statusCode: 400,
            error: tokenResult.message || "Oturum yeniden oluşturulamadı!"
        }
    }

    return {
        statusCode: 200,
        data: {
            message: "Yeni token gönderildi.",
            token: tokenResult.token
        }
    }
}

export default refreshToken;
