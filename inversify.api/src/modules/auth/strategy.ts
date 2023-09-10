import { Container } from "inversify";
import { Strategy } from "passport-http-bearer";
import * as jwt from "jsonwebtoken";
import configAuth from "./models/config.auth";
import { MongoDBClient } from "../database";
import { ModelUser, ModelUserAdmin } from "../users";
//import { injectable, inject } from 'inversify';

export function strategyfactory(mongodbClient: MongoDBClient) {
  return new Strategy(
    async function (token, cb) {
      try {
        jwt.verify(token, configAuth.secret, (err, decoded) => {
          if (err) {
            cb(null, false);
          } else {
            // if everything is good, save to request for use in other routes
            const userId = decoded.userId;
            if (!userId) {
              cb(null, false);
            } else {
              mongodbClient.findOneById(
                "User",
                userId,
                (error, data: ModelUser) => {
                  if (error) {
                    cb(null, false);
                  } else if (data.accessToken != token) {
                    cb(null, false);
                  } else {
                    cb(null, userId);
                  }
                },
              );
            }
          }
        });
      } catch (e) {
        cb(null, false);
      }
    },
  );
}

export function strategyfactoryAdmin(mongodbClient: MongoDBClient) {
  return new Strategy(
    async function (token, cb) {
      try {
        jwt.verify(token, configAuth.secret, (err, decoded) => {
          if (err) {
            cb(null, false);
          } else {
            // if everything is good, save to request for use in other routes
            const userId = decoded.userId;
            const admin = decoded.admin;
            if (!userId || !admin) {
              cb(null, false);
            } else {
              mongodbClient.findOneById(
                "UserAdmin",
                userId,
                (error, data: ModelUserAdmin) => {
                  if (error) {
                    cb(null, false);
                  } else if (data.accessToken != token) {
                    cb(null, false);
                  } else {
                    cb(null, userId);
                  }
                },
              );
            }
          }
        });
      } catch (e) {
        cb(null, false);
      }
    },
  );
}
