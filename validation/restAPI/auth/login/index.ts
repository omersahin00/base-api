import Joi from "joi";
import { LoginRequest } from "@/restAPI/domains/auth/login";

const validate = (data: LoginRequest) => {
    const schema = Joi.object<LoginRequest>({
        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "edu", "tr", "space"] } })
            .required()
            .messages({
                'string.email': 'Geçerli bir email adresi giriniz',
                'any.required': 'Email alanı zorunludur'
            }),
        password: Joi.string()
            .required()
            .messages({
                'any.required': 'Şifre alanı zorunludur'
            })
    });

    return schema.validate(data);
};

export default validate;
