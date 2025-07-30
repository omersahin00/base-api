import { Request, Response } from "express";

const unknownRoute = (req: Request, res: Response) => {
    if (!res.headersSent) {
        res.status(404).send({
            message: "Böyle bir sayfa mevcut değil."
        });
        return;
    }
};

export default unknownRoute;
