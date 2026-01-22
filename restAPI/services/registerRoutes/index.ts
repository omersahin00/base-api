import express from "express";
import handleRoute from "../handleRoute";

import isAuthForRest from "@/middlewares/auth/isAuthForRest";
const isAuth = isAuthForRest;

// TODO: Buradaki işlemler 3 kere tekrarlı bir şekilde yapılıyor. Bunları tek bir yerden yönetilecek şekilde düzenlenecek.

const registerRoutes = (router: express.Router, endpoints: any, basePath: string = "") => {
    Object.keys(endpoints).forEach(key => {
        const currentPath = basePath ? `${basePath}/${key}` : key;
        const value = endpoints[key];

        // _self anahtarını kontrol et - bu, kendi endpoint'lerini temsil eder
        if (key === '_self' && Array.isArray(value)) {
            const url = `/${basePath}`;
            value.forEach(endpoint => {
                if (endpoint.handler && typeof endpoint.handler === 'function') {
                    const method = endpoint.method.toLowerCase() as 'get' | 'post' | 'put' | 'delete';
                    const middlewares = [];

                    // Validation middleware ekle
                    if (endpoint.validation && typeof endpoint.validation === 'function') {
                        const validationMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
                            const dataToValidate = req.body || {};
                            const result = endpoint.validation(dataToValidate);

                            if (result.error) {
                                res.status(400).send({
                                    message: result.error.details[0].message
                                });
                                return;
                            } else {
                                next();
                            }
                        };
                        middlewares.push(validationMiddleware);
                    }

                    // Auth middleware ekle
                    if (endpoint.auth) {
                        middlewares.push(isAuth);
                    }

                    // Custom middleware'ler ekle (auth'dan sonra, handler'dan önce)
                    if (endpoint.middlewares && Array.isArray(endpoint.middlewares)) {
                        middlewares.push(...endpoint.middlewares);
                    }

                    router[method](url, ...middlewares, handleRoute(endpoint.handler));
                }
            });
            return; // _self işlendikten sonra devam etme
        }

        if (Array.isArray(value)) {
            // Endpoint dizisi - aynı URL'de farklı metodlar
            value.forEach(endpoint => {
                if (endpoint.handler && typeof endpoint.handler === 'function') {
                    const url = `/${currentPath}`;
                    const method = endpoint.method.toLowerCase() as 'get' | 'post' | 'put' | 'delete';
                    const middlewares = [];

                    // Validation middleware ekle (Joi fonksiyonunu Express middleware'e çevir)
                    if (endpoint.validation && typeof endpoint.validation === 'function') {
                        const validationMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
                            const dataToValidate = req.body || {};
                            const result = endpoint.validation(dataToValidate);

                            if (result.error) {
                                res.status(400).send({
                                    message: result.error.details[0].message
                                });
                                return;
                            } else {
                                next();
                            }
                        };
                        middlewares.push(validationMiddleware);
                    }

                    // Auth middleware ekle
                    if (endpoint.auth) {
                        middlewares.push(isAuth);
                    }

                    // Custom middleware'ler ekle (auth'dan sonra, handler'dan önce)
                    if (endpoint.middlewares && Array.isArray(endpoint.middlewares)) {
                        middlewares.push(...endpoint.middlewares);
                    }

                    router[method](url, ...middlewares, handleRoute(endpoint.handler));
                }
            });
        } else if (value.handler && typeof value.handler === 'function') {
            // Bu bir endpoint
            const url = `/${currentPath}`;
            const method = value.method.toLowerCase() as 'get' | 'post' | 'put' | 'delete';
            const middlewares = [];

            // Validation middleware ekle (Joi fonksiyonunu Express middleware'e çevir)
            if (value.validation && typeof value.validation === 'function') {
                const validationMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
                    const dataToValidate = req.body || {};
                    const result = value.validation(dataToValidate);

                    if (result.error) {
                        res.status(400).send({
                            message: result.error.details[0].message
                        });
                        return;
                    } else {
                        next();
                    }
                };
                middlewares.push(validationMiddleware);
            }

            // Auth middleware ekle
            if (value.auth) {
                middlewares.push(isAuth);
            }

            // Custom middleware'ler ekle (auth'dan sonra, handler'dan önce)
            if (value.middlewares && Array.isArray(value.middlewares)) {
                middlewares.push(...value.middlewares);
            }

            router[method](url, ...middlewares, handleRoute(value.handler));

        } else if (typeof value === 'object' && value !== null && !value.handler) {
            registerRoutes(router, value, currentPath); // Fonksiyona ulaşana kadar kendisini çağıracak.
        }
    })
}

export default registerRoutes;
