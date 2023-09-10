import 'reflect-metadata';
import express = require('express');
import { interfaces, InversifyExpressServer, TYPE } from 'inversify-express-utils';
import * as passport from 'passport';

import configureServices from './config/services';
import config from './config/env';
import container from './config/di';
import { configureExpress } from './config/express';
import { configureDatabase } from '../../modules/database';
var fs = require('fs');
var https = require('https');
let start = Date.now();

import './controllers/';
//configureServices(container, passport);
configureDatabase({ mongodb: config.mongodb }, container);

// create server

let server = new InversifyExpressServer(container);
server.setConfig(configureExpress);


let app = server.build();
console.log(process.cwd())

 app.listen(8001, () => {
    console.log(`server started on port 8001 (${config.env})`);
    let duration = Date.now() - start;
});

console.log(process.env.NODE_ENV);
console.log(new Date().toISOString())

