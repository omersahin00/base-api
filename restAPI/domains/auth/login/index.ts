import { Request, Response } from "express";
import { User, UserAttributes } from "@/models";
import bcrypt from "bcryptjs";
import tokenCreate from "@/services/token/create";
import setCookie from "@/services/cookie/set";
import { EndpointReturn } from "@/types/endpointReturn";
import logger from "@/services/logger";

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    message: string;
    token?: string;
    longToken?: string;
    user?: UserAttributes;
}

const login = async (
    req: Request<{}, any, LoginRequest>,
    res: Response<LoginResponse>
): Promise<EndpointReturn<LoginResponse>> => {
    const userData = req.body;

    const _user = await User.findOne({
        where: {
            email: userData.email,
            isActive: true
        }
    });

    if (!_user) {
        return {
            statusCode: 404,
            error: "Kullanıcı bulunamadı!"
        }
    }

    // Şifre kontrolü:
    if (!await bcrypt.compare(
        userData.password,
        _user.password
    )) {
        return {
            statusCode: 400,
            error: "Hatalı şifre!"
        }
    }

    const tokenResult = await tokenCreate({ userId: _user.id, email: _user.email, isLong: false });
    const longTokenResult = await tokenCreate({ userId: _user.id, email: _user.email, isLong: true });

    if (
        (!tokenResult.status || !tokenResult.token || tokenResult.token.length === 0) &&
        (!longTokenResult.status || !longTokenResult.token || longTokenResult.token.length === 0)
    ) {
        logger.error(`Token üretme hatası (login). Üretilen token'lar: shortToken:[${tokenResult.token}], longToken:[${longTokenResult.token}]`, 26);
        return {
            statusCode: 400,
            error: tokenResult.message || "Oturum açılamadı!"
        }
    }

    // Token, çerezlere kaydediliyor:
    setCookie(res, "token", tokenResult.token);

    return {
        statusCode: 200,
        data: {
            message: "Giriş başarılı.",
            // Token, aynı zamanda response olarak da dönülüyor:
            token: tokenResult.token,
            longToken: longTokenResult.token,
            user: _user
        }
    }
};

export default login;
