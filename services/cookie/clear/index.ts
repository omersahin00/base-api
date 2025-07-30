import { environment } from "@/config";
import { Response } from "express";

const clearCookie = (res: Response, name: string) => {
    res.clearCookie(name, {
        httpOnly: true,
        secure: environment === "production",
        sameSite: "strict",
    });
};

export default clearCookie;
