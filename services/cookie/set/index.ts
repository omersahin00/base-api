import { environment } from "@/config";
import { Response } from "express";

const setCookie = (res: Response, name: string, param: any) => {
    res.cookie(name, param, {
        httpOnly: true,
        secure: environment === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000, // 1 gün
    });
};

export default setCookie;
