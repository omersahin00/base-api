import { Request, Response } from "express";
import { User } from "@/models";
import { LoginResponse } from "../login";
import login from "../login";
import { bcrypt as bcryptConfig } from "@/config";
import bcrypt from "bcryptjs";
import safeStringCompare from "./safeStringCompare";
import { EndpointReturn } from "@/types/endpointReturn";

export interface RegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const register = async (
    req: Request<{}, any, RegisterRequest>,
    res: Response<LoginResponse> // Kayıt başarılı olduğunda otomatik kayıt işlemi gerçekleştirilecek.
): Promise<EndpointReturn<LoginResponse>> => {
    const userData = req.body;

    // Bu email'de kullanıcı var mı kontrolü:
    const _user = await User.findOne({
        where: {
            email: userData.email,
            // isActive: true -> Bu kısım eklenmeyecek. Çünkü birisi hesabını devredışı bıraktıktan hemen sonra aynı mail ile yeni hesap açılamayacak. Onun yerine eski hesap aktifleşecek.
        }
    });

    if (_user) {
        return {
            statusCode: 409,
            data: {
                message: "Böyle bir kullanıcı mevcut."
            }
        }
    }

    if (!safeStringCompare(userData.password, userData.confirmPassword)) {
        return {
            statusCode: 400,
            data: {
                message: "Şifreler eşleşmiyor."
            }
        }
    }

    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(userData.password, bcryptConfig.saltRounds);
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Şifreleme hatası: ${error.message}`);
        } else {
            throw new Error(`Şifreleme sırasında bilinmeyen bir hata oluştu.`);
        }
    }

    const newUser = await User.create({
        email: userData.email,
        password: hashedPassword
    });

    if (!newUser) {
        return {
            statusCode: 500,
            error: "Kayıt başarısız."
        }
    }

    try {
        // Kullanıcı gelen bilgiler ile login oluyor:
        return await login(req, res);

    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error("Login işleminde bir sorun oluştu! (Register endpointi üzerinden çalıştırılırken)");
        }
    }
};

export default register;
