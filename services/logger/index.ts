import validateLogCode from "./validate";
import logConsole from "./logConsole";
import logDB from "./logDB";

export enum levels {
    debug = 0,
    info = 1,
    warn = 2,
    error = 3,
    critical = 4
};

export default {
    debug: (message: string, code: number, control?: string) => genericLogger(message, code, "debug", control),
    info: (message: string, code: number, control?: string) => genericLogger(message, code, "info", control),
    warn: (message: string, code: number, control?: string) => genericLogger(message, code, "warn", control),
    error: (message: string, code: number, control?: string) => genericLogger(message, code, "error", control),
    critical: (message: string, code: number, control?: string) => genericLogger(message, code, "critical", control),
}

const genericLogger = async (
    message: string,
    code: number,
    level: string,
    control?: string
): Promise<boolean> => {

    ({ message, code, level } = validateLogCode(message, code, level));

    const result1 = logConsole(message, code, level);

    const result2 = control !== "notDatabase" ? await logDB(message, code, level) : true;

    return result1 && result2; // await ile beklenerek çağırılır ise başarı durumu alınabilir.
};
