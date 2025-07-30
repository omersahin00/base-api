import Joi from "joi";
import { RegisterRequest } from "@/restAPI/domains/auth/register";
import { environment } from "@/config";

const validate = (data: RegisterRequest) => {
    const schema = Joi.object<RegisterRequest>({
        firstName: Joi.string()
            .min(2)
            .max(50)
            .required()
            .messages({
                'string.min': 'İsim en az 2 karakter olmalıdır',
                'string.max': 'İsim en fazla 50 karakter olabilir',
                'any.required': 'İsim alanı zorunludur'
            }),
        lastName: Joi.string()
            .min(2)
            .max(50)
            .required()
            .messages({
                'string.min': 'Soyisim en az 2 karakter olmalıdır',
                'string.max': 'Soyisim en fazla 50 karakter olabilir',
                'any.required': 'Soyisim alanı zorunludur'
            }),
        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "edu", "tr", "space"] } })
            .required()
            .messages({
                'string.email': 'Geçerli bir email adresi giriniz',
                'any.required': 'Email alanı zorunludur'
            }),
        password: Joi.string()
            .min(environment === "development" ? 3 : 8)
            .max(100)
            .required()
            .messages({
                'string.min': `Şifre en az ${environment === "development" ? "3" : "8"} karakter olmalıdır`,
                'string.max': 'Şifre en fazla 100 karakter olabilir',
                'any.required': 'Şifre alanı zorunludur'
            }),
        confirmPassword: Joi.string()
            .valid(Joi.ref('password'))
            .required()
            .messages({
                'any.only': 'Şifreler eşleşmiyor',
                'any.required': 'Şifre onayı zorunludur'
            })
    });

    return schema.validate(data);
};

export default validate;
