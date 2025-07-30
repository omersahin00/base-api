import { Token, User } from "@/models";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import clearCookie from "@/services/cookie/clear";
import { EndpointReturn } from "@/types/endpointReturn";

export interface LogoutResponse {
    message: string;
}

interface TokenPayload {
    email: string
}

const logout = async (
    req: Request,
    res: Response<LogoutResponse>
): Promise<EndpointReturn<LogoutResponse>> => {
    const token = req.cookies.token;

    let tokenPayload: TokenPayload;
    try {
        tokenPayload = jwt.decode(token) as TokenPayload;
        if (!tokenPayload) {
            return {
                statusCode: 401,
                data: {
                    message: "Geçersiz oturum."
                }
            }
        }
    } catch (error) {
        throw new Error(`Token çözümleme hatası: ${error}`);
    }

    const _token = await Token.findOne({
        where: {
            token: token
        }
    });

    const _user = await User.findOne({
        where: {
            email: tokenPayload.email,
            isActive: true
        },
        raw: true
    });

    if (!_token || !_user) {
        return {
            statusCode: 400,
            data: {
                message: "Token doğrulanamadı!"
            }
        }
    }

    try {
        await _token.destroy();

        clearCookie(res, "token");

        return {
            statusCode: 200,
            data: {
                message: "Çıkış başarılı."
            }
        }
    } catch (error) {
        throw new Error(`Token silinirken bir sorun oluştu!`);
    }
};

export default logout;
