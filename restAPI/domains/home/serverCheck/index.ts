import { EndpointReturn } from "@/types/endpointReturn";
import { Request, Response, RequestHandler } from "express";

const serverCheck = (
    req: Request,
    res: Response
): EndpointReturn => {

    return {
        statusCode: 200,
        data: {
            message: "API is working."
        }
    }
};

export default serverCheck;
