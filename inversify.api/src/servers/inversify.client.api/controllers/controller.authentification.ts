import { httpGet, httpPost, controller } from 'inversify-express-utils';
import { injectable, inject } from 'inversify';
import { validateBody, validateQuery, authorize, authorizeAdmin, ResponseFailure } from '../../../modules/common';

import { Request, Response, NextFunction } from 'express';

import { TYPES } from '../../../modules/common';
import { ServiceAuthentification, UserEmailAuthRequest, UserEmailPasswordAuthRequest, AccesTokenAuthResponse, AuthResponse, UserEmailRefreshTokenAuthRequest } from '../../../modules/auth/index';
import { CreateUserRequest, FindUserByEmailRequest, ServiceUser, UserResponse, FindUserByEmailVerificationIdRequest, FindUserByPasswordVerificationIdRequest } from '../../../modules/users/index';
import { ApiPath, ApiOperationPost, ApiOperationPut, ApiOperationDelete, SwaggerDefinitionConstant, ApiOperationGet } from 'swagger-express-ts';
const querystring = require('querystring');

@ApiPath({
    path: "/auth",
    name: "Authentification",
})
@controller('/auth')
export class ControllerAuthentification {
    constructor(
        @inject(TYPES.ServiceAuthentification) private serviceAuthentification: ServiceAuthentification,
        @inject(TYPES.ServiceUser) private serviceUser: ServiceUser,
    ) { }

    @ApiOperationPost({
        path: '/signup',
        description: "Signup",
        summary: "Signup",
        parameters: {
            body: { description: "Signup", required: true, model: "CreateUserRequest" }
        },

        responses: {
            200: { model: "AuthResponse" },
            400: { model: "AuthErrorResponse" },
            500: { model: "AuthErrorResponse" }
        },
    })
    @httpPost('/signup', validateBody(CreateUserRequest))
    public async signup(req: Request, res: Response) {
        try {
            const resp = await this.serviceAuthentification.signup(req.body, req.get('host'));
            if (!resp) {
                res.status(400).send(`Object AuthResponse is null`);
            }
            else
                res.status(resp.code).send(resp);

        } catch (ex) {
            res.status(500).send(ResponseFailure(500, ex));
        }
    }


    @ApiOperationPost({
        path: '/signin',
        description: "Signin",
        summary: "Signin",
        parameters: {
            body: { description: "Signin", required: true, model: "UserEmailPasswordAuthRequest" }
        },

        responses: {
            200: { model: "AuthResponse" },
            400: { model: "AccesTokenAuthResponse" }
        },
    })
    @httpPost('/signin', validateBody(UserEmailPasswordAuthRequest))
    public async signin(req: Request, res: Response) {
        try {
            const resp = await this.serviceAuthentification.signin(req.body);
            if (!resp) {
                res.status(400).send(`Object AuthResponse is null`);
            }
            else
                res.status(resp.code).send(resp);
        } catch (ex) {
            console.log(ex);
            res.status(500).send(ResponseFailure(500, ex));
        }
    }

    @ApiOperationPost({
        path: '/refreshToken',
        description: "RefreshToken",
        summary: "RefreshToken",
        parameters: {
            body: { description: "refreshToken", required: true, model: "UserEmailRefreshTokenAuthRequest" }
        },

        responses: {
            200: { model: "AuthResponse" },
            400: { model: "AccesTokenAuthResponse" }
        },
    })
    @httpPost('/refreshToken', validateBody(UserEmailRefreshTokenAuthRequest))
    public async refreshToken(req: Request, res: Response) {
        try {
            const resp = await this.serviceAuthentification.refreshToken(req.body);
            if (!resp) {
                res.status(400).send(`Object AuthResponse is null`);
            }
            else
                res.status(resp.code).send(resp);
        } catch (ex) {
            res.status(500).send(ResponseFailure(500, ex));
        }
    }


    @ApiOperationPost({
        path: '/find/email/exist',
        description: "Find email exist",
        summary: "Find email exist",
        parameters: {
            body: { description: "Find email exist", required: true, model: "FindUserByEmailRequest" }
        },

        responses: {
            200: { model: "UserResponse" },
            400: { model: "UserErrorResponse" },
            500: { model: "UserErrorResponse" }
        },
    })
    @httpPost('/find/email/exist', validateBody(FindUserByEmailRequest))
    public async userWithEmailExist(req: Request, res: Response) {
        try {
            const resp = await this.serviceUser.userWithEmailExist(req.body);
            if (!resp) {
                res.status(400).send(`Object UserResponse is null`);
            }
            else
                res.status(resp.code).send(resp);

        } catch (ex) {
            res.status(500).send(ResponseFailure(500, ex));
        }
    }

    @ApiOperationGet({
        path: '/verify',
        description: "Verify email",
        summary: "Verify email",
        parameters: {
            query: {
                id: {
                    required: true,
                    type: SwaggerDefinitionConstant.Parameter.Type.STRING,
                }
            }
        },

        responses: {
            200: { model: "UserResponse" },
            400: { model: "UserErrorResponse" },
            405: { model: "UserErrorResponse" },
            500: { model: "UserErrorResponse" }
        },
    })
    @httpGet('/verify')
    public async verify(req: Request, res: Response) {
        try {
            if ((req.protocol + "://" + req.get('host')) == ("http://" + req.get('host'))) {
                const find = new FindUserByEmailVerificationIdRequest();
                let parsedQs = querystring.parse(req.query);
                find.emailVerificationId = parsedQs.id;

                const resp = await this.serviceUser.verifyEmail(find);
                console.log("Domain is matched. Information is from Authentic email");
                if (!resp) {
                    res.status(400).send(`Object UserResponse is null`);
                }
                else
                    res.status(resp.code).send(resp);
            }
            else {
                res.status(405).send(ResponseFailure(405, "Request is from unknown source"));
            }

        } catch (ex) {
            res.status(500).send(ResponseFailure(500, ex));
        }
    }

    @ApiOperationPost({
        path: '/forgetPassword',
        description: "Forget password",
        summary: "Forget password",
        parameters: {
            body: { description: "Forget password", required: true, model: "FindUserByEmailRequest" }
        },

        responses: {
            200: { model: "UserResponse" },
            400: { model: "UserErrorResponse" },
            500: { model: "UserErrorResponse" }
        },
    })
    @httpPost('/forgetPassword', validateBody(FindUserByEmailRequest))
    public async forgetPassword(req: Request, res: Response) {
        try {
            if ((req.protocol + "://" + req.get('host')) == ("https://" + req.get('host'))) {
                const find = new FindUserByEmailVerificationIdRequest();
                let parsedQs = querystring.parse(req.query);
                find.emailVerificationId = parsedQs.id;

                const resp = await this.serviceUser.forgetPassword(req.body, req.get('host'));
                if (!resp) {
                    res.status(400).send(`Object UserResponse is null`);
                }
                else
                    res.status(resp.code).send(resp);
            }
            else {
                res.status(405).send(ResponseFailure(405, "Request is from unknown source"));
            }

        } catch (ex) {
            res.status(500).send(ResponseFailure(500, ex));
        }
    }


    @ApiOperationGet({
        path: '/resetPassword',
        description: "Reset Password",
        summary: "Reset Password",
        parameters: {
            query: {
                passwordVerificationId: {
                    required: true,
                    type: SwaggerDefinitionConstant.Parameter.Type.STRING,
                }
            }
        },

        responses: {
            200: { model: "UserResponse" },
            400: { model: "UserErrorResponse" },
            405: { model: "UserErrorResponse" },
            500: { model: "UserErrorResponse" }
        },
    })
    @httpGet('/resetPassword', validateQuery(FindUserByPasswordVerificationIdRequest))
    public async resetPassword(req: Request, res: Response) {
        try {
            if ((req.protocol + "://" + req.get('host')) == ("https://" + req.get('host'))) {
                let parsedQs = querystring.parse(req.query);

                const resp = await this.serviceUser.generatePassword(parsedQs);
                if (!resp) {
                    res.status(400).send(`Object UserResponse is null`);
                }
                else
                    res.status(resp.code).send(resp);
            }
            else {
                res.status(405).send(ResponseFailure(405, "Request is from unknown source"));
            }

        } catch (ex) {
            res.status(500).send(ResponseFailure(500, ex));
        }
    }
}
