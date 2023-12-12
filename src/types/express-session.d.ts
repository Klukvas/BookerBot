declare namespace Express {
    interface CustomSessionFields {
        token: string
    }

    export interface Request {
        session: Session & Partial<SessionData> & CustomSessionFields
    }
}