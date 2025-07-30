import { Token, User, UserAttributes, UserInstance } from "@/models";
import jwt from "jsonwebtoken";
import { token as tokenConfig } from "@/config";
import { tokenPayload } from "../create";

export interface tokenControlResponse {
    status: boolean;
    user?: UserAttributes;
    message: string;
}

const tokenControl = async (token: string, requireLong: boolean = false): Promise<tokenControlResponse> => {
    if (!token || token.length === 0) {
        return {
            status: false,
            message: "Oturum gönderilmedi!"
        }
    }

    let tokenVerify: tokenPayload;
    try {
        tokenVerify = jwt.verify(token, tokenConfig.JWT_KEY) as tokenPayload;

    } catch (error) {
        if (error instanceof Error) {
            if (error.name === "TokenExpiredError") {
                return {
                    status: false,
                    message: "Oturum süresi dolmuş!"
                }
            } else {
                return {
                    status: false,
                    message: "Oturum geçersiz"
                }
            }
        } else {
            throw new Error(`Bir sorun oluştu: ${error}`);
        }
    }

    // İstenen token tipi ile gönderilen tip aynı mı kontrol ediliyor:
    if (tokenVerify.isLong !== requireLong) {
        return {
            status: false,
            message: "İstenen token tipi ile gönderilen uyuşmamakta!"
        }
    }

    // Token eğer long ise veritabanından doğrulanıyor:
    if (tokenVerify.isLong) {
        const _token = await Token.findOne({
            where: {
                token: token
            }
        });

        if (!_token) {
            return {
                status: false,
                message: "Token veritabanında bulunamadı! (services/token/control)"
            }
        }

        // Token süresi denetleniyor:
        const tokenDate = _token.createdAt ? new Date(_token.createdAt) : null;
        if (!tokenDate) {
            return {
                status: false,
                message: "Token süresi doğrulanamadı!"
            }
        }

        // Token süresi geçmiş mi kontrol ediliyor (db'den gelen veriye göre):
        // Bu kısmın eklenme nedeni, longToken'ların üretildikten sonra sürelerinde sunucu taraflı değişikliğe gidilirse artık o yeni süreye göre değerlendirilsinler diye.
        // Bu işlem longToken'a özel.
        let validityPeriodInMilliseconds = 60 * 60 * 1000; // 1 saate karşılık gelmektedir.

        validityPeriodInMilliseconds *= Number(tokenConfig.longExpirationDate.number) * 24; // Long token süresi (günlük)

        if (tokenDate.getTime() + validityPeriodInMilliseconds < Date.now()) {
            return {
                status: false,
                message: "Oturum süresi dolmuş."
            }
        }
    }

    const _user = await User.findOne({
        where: {
            email: tokenVerify.email,
            isActive: true
        }
    });

    if (!_user) {
        return {
            status: false,
            message: "Kullanıcı bilgileri veritabanında bulunamadı! (services/token/control)"
        }
    }

    return {
        status: true,
        user: _user,
        message: "Oturum doğrulandı."
    }
};

export default tokenControl;
