import { httpGet, httpPost, httpPut, httpDelete, controller } from 'inversify-express-utils';

import { injectable, inject } from 'inversify';

import { Request, Response, NextFunction } from 'express';
import { validateBody, validateQuery, authorize, authorizeAdmin, validate, ResponseFailure, validateParams } from '../../../modules/common';


import { TYPES } from '../../../modules/common';
import { ServiceUser, FindUserByIdRequest, UserResponse, FindUserByEmailRequest, EditUserRequest, EditUserPasswordRequest} from '../../../modules/users/index';
import * as jwt from 'jsonwebtoken';
import config from '../config/env';
import { ApiPath, ApiOperationPost, ApiOperationPut, ApiOperationDelete, SwaggerDefinitionConstant } from 'swagger-express-ts';
const querystring = require('querystring');


@ApiPath({
    path: "/user",
    name: "User",
    security: { apiKeyHeader: [] }
})
//@injectable()
@controller('/user', authorize())
export class ControllerUser {
    constructor(
        @inject(TYPES.ServiceUser) private serviceUser: ServiceUser,

    ) { }

    @ApiOperationPost({
        path: '/find/userId',
        description: "Find user by userId",
        summary: "Find user by userId",
        parameters: {
            body: { description: "Find user by userId", required: true, model: "FindUserByIdRequest" }
        },

        responses: {
            200: { model: "UserResponse" },
            400: { model: "UserErrorResponse" },
            405: { model: "UserErrorResponse" },
            500: { model: "UserErrorResponse" }
        },
        security: { apiKeyHeader: [] }
    })

    @httpPost('/find/userId', validateBody(FindUserByIdRequest))
    public async find(req: Request, res: Response) {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decodedToken = jwt.verify(token, config.secret);
            if (decodedToken.userId != req.body.userId) {
                res.status(405).send(ResponseFailure(405, `User with this id ${req.body.userId} is not allowed`));
            }
            else {
                const resp = await this.serviceUser.find(req.body);
                if (!resp) {
                    res.status(400).send(`Object UserResponse is null`);
                }
                else
                    res.status(resp.code).send(resp);
            }
        } catch (ex) {
            res.status(500).send(ResponseFailure(500, ex));
        }
    }

    @ApiOperationPost({
        path: '/find/email',
        description: "Find user by email",
        summary: "Find user by email",
        parameters: {
            body: { description: "Find user by email", required: true, model: "FindUserByEmailRequest" }
        },

        responses: {
            200: { model: "UserResponse" },
            400: { model: "UserErrorResponse" },
            405: { model: "UserErrorResponse" },
            500: { model: "UserErrorResponse" }
        },
        security: { apiKeyHeader: [] }
    })
    @httpPost('/find/email', validateBody(FindUserByEmailRequest))
    public async findByEmail(req: Request, res: Response) {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decodedToken = jwt.verify(token, config.secret);
            if (decodedToken.email != req.body.email) {
                res.status(405).send(ResponseFailure(405, `User with this email ${req.body.email} is not allowed`));
            }
            else {
                const resp = await this.serviceUser.findByEmail(req.body);
                if (!resp) {
                    res.status(400).send(`Object UserResponse is null`);
                }
                else
                    res.status(resp.code).send(resp);
            }
        } catch (ex) {
            res.status(500).send(ResponseFailure(500, ex));
        }
    }

    @ApiOperationPut({
        path: '/update/userId',
        description: "Update user by userId",
        summary: "Update user by userId",
        parameters: {
            body: { description: "Update user by userId", required: true, model: "EditUserRequest" }
        },

        responses: {
            200: { model: "UserResponse" },
            400: { model: "UserErrorResponse" },
            405: { model: "UserErrorResponse" },
            500: { model: "UserErrorResponse" }
        },
        security: { apiKeyHeader: [] }
    })
    @httpPut('/update/userId', validateBody(EditUserRequest))
    public async update(req: Request, res: Response) {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decodedToken = jwt.verify(token, config.secret);
            if (decodedToken.userId != req.body.userId) {
                res.status(405).send(ResponseFailure(405, `User with this email ${req.body.email} is not allowed`));
            }
            else {
                const resp = await this.serviceUser.update(req.body);
                if (!resp) {
                    res.status(400).send(`Object UserResponse is null`);
                }
                else
                    res.status(resp.code).send(resp);
            }
        } catch (ex) {
            res.status(500).send(ResponseFailure(500, ex));
        }
    }

    @ApiOperationPut({
        path: '/update/password',
        description: "Update password of user by userId",
        summary: "Update password of user by userId",
        parameters: {
            body: { description: "Update password of by userId", required: true, model: "EditUserPasswordRequest" }
        },

        responses: {
            202: { model: "UserResponse" },
            400: { model: "UserErrorResponse" },
            405: { model: "UserErrorResponse" },
            500: { model: "UserErrorResponse" }
        },
        security: { apiKeyHeader: [] }
    })
    @httpPut('/update/password', validateBody(EditUserPasswordRequest))
    public async editPassword(req: Request, res: Response) {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decodedToken = jwt.verify(token, config.secret);
            if (decodedToken.userId != req.body.userId) {
                res.status(405).send(ResponseFailure(405, `User with this id ${req.body.userId} is not allowed`));
            }
            else {
                const resp = await this.serviceUser.editPassword(req.body);
                if (!resp) {
                    res.status(400).send(`Object UserResponse is null`);
                }
                else
                    res.status(resp.code).send(resp);
            }
        }
        catch (ex) {
            res.status(500).send(ResponseFailure(500, ex));
        }
    }

    @ApiOperationPost({
        path: '/send/emailVerification',
        description: "Send email to user by userId",
        summary: "Send email to user by userId",
        parameters: {
            body: { description: "Send email to user by userId", required: true, model: "FindUserByIdRequest" }
        },

        responses: {
            202: { model: "UserResponse" },
            400: { model: "UserErrorResponse" },
            405: { model: "UserErrorResponse" },
            500: { model: "UserErrorResponse" }
        },
        security: { apiKeyHeader: [] }
    })
    @httpPost('/send/emailVerification', validateBody(FindUserByIdRequest))
    public async sendEmailVerification(req: Request, res: Response) {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decodedToken = jwt.verify(token, config.secret);
            if (decodedToken.userId != req.body.userId) {
                res.status(405).send(ResponseFailure(405, `User with this id ${req.body.userId} is not allowed`));
            }
            else {
                const resp = await this.serviceUser.sendEmailVerification(req.body, req.get('host'));
                if (!resp) {
                    res.status(400).send(`Object UserResponse is null`);
                }
                else
                    res.status(resp.code).send(resp);
            }
        } catch (ex) {
            res.status(500).send(ResponseFailure(500, ex));
        }
    }

    @ApiOperationDelete({
        path: '/remove/userId',
        description: "Delete user by userId",
        summary: "Delete user by userId",
        parameters: {
            query: {
                userId: {
                    description: "Id of user",
                    type: SwaggerDefinitionConstant.Parameter.Type.STRING,
                    required: true
                }
            }
        },

        responses: {
            200: { model: "UserResponse" },
            400: { model: "UserErrorResponse" },
            405: { model: "UserErrorResponse" },
            500: { model: "UserErrorResponse" }
        },
        security: { apiKeyHeader: [] }
    })
    @httpDelete('/remove/userId', validateQuery(FindUserByIdRequest))
    public async remove(req: Request, res: Response) {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decodedToken = jwt.verify(token, config.secret);
            if (decodedToken.userId != req.query.userId) {
                res.status(405).send(ResponseFailure(405, `User with this id ${req.query.userId} is not allowed`));
            }
            else {
                let parsedQs = querystring.parse(req.query);
                const resp = await this.serviceUser.remove(parsedQs);
                if (!resp) {
                    res.status(400).send(`Object UserResponse is null`);
                }
                else
                    res.status(resp.code).send(resp);
            }
        } catch (ex) {
            res.status(500).send(ResponseFailure(500, ex));
        }
    }
}

