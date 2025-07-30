import express from "express";
import handleRoute from "../handleRoute";

import isAuthForRest from "@/middlewares/auth/isAuthForRest";
const isAuth = isAuthForRest;

const registerRoutes = (router: express.Router, endpoints: any, basePath: string = "") => {
    Object.keys(endpoints).forEach(key => {
        const currentPath = basePath ? `${basePath}/${key}` : key;
        const value = endpoints[key];

        if (value.handler && typeof value.handler === 'function') {
            // Bu bir endpoint
            const url = `/${currentPath}`;
            const method = value.method.toLowerCase() as 'get' | 'post';
            const middlewares = value.auth ? [isAuth] : [];

            router[method](url, ...middlewares, handleRoute(value.handler));

        } else if (typeof value === 'object' && value !== null && !value.handler) {
            registerRoutes(router, value, currentPath); // Fonksiyona ulaşana kadar kendisini çağıracak.
        }
    })
}

export default registerRoutes;
