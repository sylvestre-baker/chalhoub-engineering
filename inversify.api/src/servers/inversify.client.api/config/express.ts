import { Application } from 'express';
import * as express from "express";
import container from './di';
import * as bodyParser from 'body-parser';
import config from './env';
const cors = require('cors');

import * as swagger from "swagger-express-ts";
import { SwaggerDefinitionConstant } from "swagger-express-ts";
import { useAuth } from '../../../modules/auth';
import { useServiceUser } from '../../../modules/users';
import { useServiceEvent } from '../../../modules/events';

export function configureExpress(app: Application) {

     app.use('/api-docs/swagger', express.static('swagger'));
    app.use('/api-docs/swagger/assets', express.static('node_modules/swagger-ui-dist'));

    app.use(swagger.express(
        {
            definition: {
                info: {
                    title: `${config.swagger.title}`,
                    version: "1.0"
                },
                schemes: ['https', 'http'],
                externalDocs: {
                    url: `${config.host}`
                },
                securityDefinitions: {
                    apiKeyHeader: {
                        type: SwaggerDefinitionConstant.Security.Type.API_KEY,
                        in: SwaggerDefinitionConstant.Security.In.HEADER,
                        name: 'Authorization',
                    }
                }
                // Models can be defined here
            }
        }
    ));

    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

    // disable 'X-Powered-By' header in response
    app.disable('x-powered-by');

    // enable CORS - Cross Origin Resource Sharing
    app.use(cors());

    app.set('superSecret', config.secret); // secret variable
    useAuth(app, container);
    useServiceUser(container);
    useServiceEvent(container);

}
