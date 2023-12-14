import pinoHttp from "pino-http"
import { appLogger } from "../core/logger"

export const httpLogger = pinoHttp({
    logger: appLogger,
    useLevel: 'info'
})