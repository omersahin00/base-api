import express from "express";
import http from "http";
import cors from "cors";
import { sequelize } from "@data/db";
import cookieParser from "cookie-parser";
import { database, environment, port } from "./config";
import Schedulers from "./schedulers";

const app = express();
const server = http.createServer(app);

app.use(cors({
    origin: true,
    methods: ["GET", "POST", "DELETE", "PATCH", "PUT", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie", "X-Requested-With"],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

import router from "./restAPI";
app.use(router);

import "./models"; // Model senkronizeleri için import edilmesi gerekiyor.
// Global request tipleri için kullanılan tip dosyası:
import globalTypes from "./types/globalTypes"; // KULLANIMDA SİLME!
import unknownRoute from "./restAPI/domains/home/unknownRoute";
import logger from "./services/logger";
app.use(unknownRoute);

(async (): Promise<void> => {
    try {
        if (database.access !== "false") {
            await sequelize.sync({
                alter: environment === "development" ? true : false
            });
        }

        server.listen(port, () => {
            logger.info(`API listen on port ${port}`, 1);
        });

        Schedulers();

    } catch (error) {
        console.error("Error:", error instanceof Error ? error.message : error);
    }
})();
