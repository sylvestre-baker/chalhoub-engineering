export * from "./models";
export * from "./services";

import * as passport from "passport";
import { Application } from "express";
import { Container } from "inversify";
import { strategyfactory, strategyfactoryAdmin } from "./strategy";
import { ServiceAuthentification } from "./services";
import { TYPES } from "../common";
import configAuth from "./models/config.auth";
import { MongoDBClient } from "../database";

export function useAuth(app: Application, container: Container) {
  app.use(passport.initialize());
  configAuth.secret = app.get("superSecret");
  const mongodbClient = container.get<MongoDBClient>(TYPES.MongoDBClient);
  passport.use(strategyfactory(mongodbClient));
  passport.use("bearer-admin", strategyfactoryAdmin(mongodbClient));
  container.bind<ServiceAuthentification>(TYPES.ServiceAuthentification).to(
    ServiceAuthentification,
  );
}
