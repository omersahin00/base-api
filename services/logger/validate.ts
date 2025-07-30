import { levels } from ".";

const validateLogCode = (
    message: string,
    code: number,
    level: string
): {
    message: string,
    code: number,
    level: string
} => {

    message = message.trim();
    
    code = !code ? 0 : code;

    if (level in levels) {
        const value = levels[level as keyof typeof levels];
        code = (code % 100) + (value * 100);
    }

    return {
        message,
        code,
        level
    }
};

export default validateLogCode;
