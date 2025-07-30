import { UserAttributes } from "../models";

declare global {
    namespace Express {
        interface Request {
            user: UserAttributes;
            isSessional?: boolean;
            token?: string;
        }
    }
}

export {};
