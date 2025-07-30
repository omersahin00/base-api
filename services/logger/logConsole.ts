import { environment } from "@/config";

const messageTemplateProd = `[{{code}}]: {{message}}`;
const messageTemplateDev = `{{message}}`;

const logConsole = (message: string, code: number, level: string): boolean => {
    const logMessage = (environment === "production"
        ? messageTemplateProd
        : messageTemplateDev)
        .replace("{{code}}", code.toString().length === 2 ? "0" + code.toString() : code.toString())
        .replace("{{message}}", message);

    switch(level) {
        case "debug": {
            console.log(logMessage);
            break;
        };
        case "info": {
            console.log(logMessage);
            break;
        }
        case "warn": {
            console.warn(logMessage);
            break;
        }
        case "error": {
            console.error(logMessage);
            break;
        }
        case "critical": {
            console.error(logMessage);
            break;
        }
        default: {
            console.error("--> Gelen uyarı mesajının tipi hatalı yazılmış (logger/logConsole.ts):", level.toString());
            return false;
        }
    }

    return true;
}

export default logConsole;
