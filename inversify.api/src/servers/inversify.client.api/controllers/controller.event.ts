import { httpGet, httpPost, httpPut, httpDelete, controller } from 'inversify-express-utils';

import { injectable, inject } from 'inversify';

import { Request, Response, NextFunction } from 'express';
import { validateBody, validateQuery, authorize, authorizeAdmin, validate, ResponseFailure, validateParams } from '../../../modules/common';


import { TYPES } from '../../../modules/common';
import { EventCreateRequest, EventGetByIdRequest, ServiceEvent } from '../../../modules/events/index';
import * as jwt from 'jsonwebtoken';
import config from '../config/env';
import { ApiPath, ApiOperationPost, ApiOperationPut, ApiOperationDelete, SwaggerDefinitionConstant, ApiOperationGet } from 'swagger-express-ts';
const querystring = require('querystring');


@ApiPath({
    path: "/event",
    name: "Event",
    security: { apiKeyHeader: [] }
})
@controller('/event', authorize())
export class ControllerEvent {
    constructor(
        @inject(TYPES.ServiceEvent) private serviceEvent: ServiceEvent,

    ) { }

    @ApiOperationGet({
        path: '',
        description: "Get all Events",
        summary: 'Get all Events',

        responses: {
            200: { model: "EventsResponse" },
            400: { model: "EventErrorResponse" },
            404: { model: "EventErrorResponse" },
            405: { model: "EventErrorResponse" },
            500: { model: "EventErrorResponse" }
        },
        security: { apiKeyHeader: [] }
    })

    @httpGet('/')
    public async getAll(req: Request, res: Response) {
        try {
            const resp = await this.serviceEvent.getAll();
            if (!resp) {
                res.status(400).send(`Object EventsResponse is null`);
            }
            else
                res.status(resp.code).send(resp);

        } catch (ex) {
            res.status(500).send(ResponseFailure(500, ex));
        }
    }

    @ApiOperationGet({
        path: '/:eventId',
        description: "Get event by eventId",
        summary: "Get event by eventId",
        parameters: {
            query: {
                userId: {
                    description: "Id of event",
                    type: SwaggerDefinitionConstant.Parameter.Type.STRING,
                    required: true
                }
            }
        },

        responses: {
            200: { model: "EventResponse" },
            400: { model: "EventErrorResponse" },
            404: { model: "EventErrorResponse" },
            405: { model: "EventErrorResponse" },
            500: { model: "EventErrorResponse" }
        },
        security: { apiKeyHeader: [] }
    })

    @httpGet('/', validateParams(EventGetByIdRequest))
    public async find(req: Request, res: Response) {
        try {
            const eventGetByIdRequest : EventGetByIdRequest = new EventGetByIdRequest();
            eventGetByIdRequest.eventId = req.params.eventId;
            const resp = await this.serviceEvent.get(eventGetByIdRequest);
            if (!resp) {
                res.status(400).send(`Object EventResponse is null`);
            }
            else
                res.status(resp.code).send(resp);

        } catch (ex) {
            res.status(500).send(ResponseFailure(500, ex));
        }
    }

    @ApiOperationPost({
        path: '',
        description: "Create Event",
        summary: 'Create Event',
        parameters: {
            body: { description: "Create event request", required: true, model: "EventCreateRequest" }
        },

        responses: {
            200: { model: "EventResponse" },
            400: { model: "EventErrorResponse" },
            404: { model: "EventErrorResponse" },
            405: { model: "EventErrorResponse" },
            500: { model: "EventErrorResponse" }
        },
        security: { apiKeyHeader: [] }
    })

    @httpPost('/', validateBody(EventCreateRequest))
    public async create(req: Request, res: Response) {
        try {
            const resp = await this.serviceEvent.create(req.body);
            if (!resp) {
                res.status(400).send(`Object EventResponse is null`);
            }
            else
                res.status(resp.code).send(resp);

        } catch (ex) {
            res.status(500).send(ResponseFailure(500, ex));
        }
    }

}