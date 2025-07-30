import { NextFunction, Request, Response } from "express";

const errorCatcher = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (err.message && err.message.length > 0) {
        console.log("Sistemde bir sorun oluştu:", err.message);
    }
    else {
        console.log("Bilinmeyen bir sorun oluştu:", err);
    }

    res.status(500).send({
        error: {
            message: "Bilinmeyen bir sorun oluştu."
        }
    });
    return;
}

export default errorCatcher;
