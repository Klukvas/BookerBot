import pinoHttp from "pino-http"
import { appLogger } from "../utils/core/logger"

export const httpLogger = pinoHttp({
    logger: appLogger,
    useLevel: 'info'
})