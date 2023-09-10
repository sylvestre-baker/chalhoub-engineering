import { httpGet, controller } from 'inversify-express-utils';
import { injectable } from 'inversify';

import { Request, Response, NextFunction } from 'express';
import config from '../config/env/development';

@controller('/')
//@injectable()
export class ControllerHome {
    constructor(
    ) {
    }

    @httpGet('/')
    public get(req: Request, res: Response, next: NextFunction): any {
        return `inversify.api ${config.env} server is running!`;
    }
}
