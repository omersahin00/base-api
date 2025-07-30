import Joi from "joi";
import { RefreshTokenRequest } from "@/restAPI/domains/auth/refreshtoken";

const validate = (data: RefreshTokenRequest) => {
    const schema = Joi.object<RefreshTokenRequest>({
        longToken: Joi.string()
            .required()
            .messages({
                'string.base': 'longToken bir string olmalıdır',
                'any.required': 'longToken alanı zorunludur'
            })
    });
    
    return schema.validate(data);
};

export default validate;
