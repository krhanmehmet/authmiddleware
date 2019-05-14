import * as express from 'express';
export declare const Auth: (config: {
    scope?: string | undefined;
    role?: number | undefined;
}) => (req: express.Request, res: express.Response, next: express.NextFunction) => void;
