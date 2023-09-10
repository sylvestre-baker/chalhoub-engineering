import { inject, injectable } from "inversify";
import {
  ResponseFailure,
  ResponseSuccess,
  TYPES,
} from "../../common";

import {
  AccesTokenAuthAdminResponse,
  AccesTokenAuthResponse,
  PhoneNumberAuthRequest,
  SendEmailPasswordLostResponse,
  SendEmailVerificationResponse,
  UserEmailAuthRequest,
  UserEmailPasswordAuthRequest,
  UserEmailRefreshTokenAuthRequest,
} from "../models";
import { ServiceUser, StoreUser } from "../../users";
import { CreateUserRequest, UserResponse } from "../../users/models/user";
import configAuth from "../models/config.auth";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import * as generator from "generate-password";
import { IModelResponse } from "../../interfaces/api/index";
import * as randtoken from "rand-token";
import parsePhoneNumber from "libphonenumber-js";

@injectable()
export class ServiceAuthentification {
  constructor(
    @inject(TYPES.StoreUser) private storeUser: StoreUser,
    @inject(TYPES.ServiceUser) private serviceUser: ServiceUser,
  ) {
  }


  async signup(
    newUser: CreateUserRequest,
    host: string,
  ): Promise<IModelResponse> {
    try {
      newUser.email = newUser.email.toLowerCase();

      let accesTokenAuthResponse = new AccesTokenAuthResponse();
      let user = await this.storeUser.getByEmail(newUser.email);
      if (user) {
        return (ResponseFailure(
          400,
          `User with this email ${newUser.email} already exists`,
        ));
      } else {
        const userResp = await this.serviceUser.create(newUser, host);
        if (!userResp.data) {
          return userResp;
        } else {
          user = userResp.data;
          const payload = {
            admin: user.isAdmin,
            claims: user.claims,
            userId: user._id,
          };

          const token = jwt.sign(payload, configAuth.secret, {
            expiresIn: 60 * 60 * 2, // expires in 2 hours
          });
          const refreshToken = randtoken.uid(256);
          user = await this.storeUser.setAccessToken(
            user._id.toString(),
            token,
            refreshToken,
          );
          accesTokenAuthResponse.user = user;
          accesTokenAuthResponse.access_token = token;
          delete accesTokenAuthResponse.user.password;
          delete accesTokenAuthResponse.user.oldPasswords;
          delete accesTokenAuthResponse.user.accessToken;

          return ResponseSuccess(200, accesTokenAuthResponse);
        }
      }
    } catch (error) {
      return ResponseFailure(500, error);
    }
  }

  /* async signupAdmin(newUser: CreateUserAdminRequest, host: string): Promise<IModelResponse> {
        try {
            newUser.email = newUser.email.toLowerCase();
            let accesTokenAuthResponse = new AccesTokenAuthAdminResponse();
            let user = await this.storeUserAdmin.getByEmail(newUser.email);
            if (user) {
                return (ResponseFailure(400, `User with this email ${newUser.email} already exists`))
            }

            else {
                const userResp = await this.serviceUserAdmin.create(newUser, host);
                if (!userResp.data) {
                    return userResp;
                }
                else {
                    user = userResp.data;
                    const payload = {
                        admin: user.isAdmin,
                        claims: user.claims,
                        userId: user._id
                    };

                    const token = jwt.sign(payload, configAuth.secret, {
                        expiresIn: 60 * 60 * 24 * 30 // expires in 30 days
                    });
                    const refreshToken = randtoken.uid(256);
                    user = await this.storeUserAdmin.setAccessToken(user._id.toString(), token, refreshToken);

                    accesTokenAuthResponse.user = user;
                    accesTokenAuthResponse.access_token = token;
                    delete accesTokenAuthResponse.user.password;
                    delete accesTokenAuthResponse.user.oldPasswords;
                    delete accesTokenAuthResponse.user.accessToken;
                    return ResponseSuccess(200, accesTokenAuthResponse);
                }
            }
        }
        catch (error) {
            return ResponseFailure(500, error)
        }
    }
*/
    async signin(userSignin: UserEmailPasswordAuthRequest): Promise<IModelResponse> {
        try {
            userSignin.email = userSignin.email.toLowerCase();
            let accesTokenAuthResponse = new AccesTokenAuthResponse();
            let user = await this.storeUser.getByEmail(userSignin.email);
            if (!user) {
                return (ResponseFailure(400, `User with this email ${userSignin.email} does not exist`))
            }
            else if (await bcrypt.compare(userSignin.password, user.password) == false) {
                return (ResponseFailure(400, `User with this email ${userSignin.email} bad password`))

            }
            else {
                const payload = {
                    admin: user.isAdmin,
                    claims: user.claims,
                    userId: user._id
                };

                const token = jwt.sign(payload, configAuth.secret, {
                    expiresIn: 60 * 60 * 2  // expires in 2 hours
                });
                const refreshToken = randtoken.uid(256);
                user = await this.storeUser.setAccessToken(user._id.toString(), token, refreshToken);
                if (!user.emailVerificationId)
                    user.emailVerificationId = '';
                accesTokenAuthResponse.user = user;
                accesTokenAuthResponse.access_token = token;
                delete accesTokenAuthResponse.user.password;
                delete accesTokenAuthResponse.user.oldPasswords;
                delete accesTokenAuthResponse.user.accessToken;
                return ResponseSuccess(200, accesTokenAuthResponse);
            }
        }
        catch (error) {
            return ResponseFailure(500, error)
        }
    }
/*
    async signinAdmin(userSignin: UserEmailPasswordAuthRequest): Promise<IModelResponse> {
        try {
            userSignin.email = userSignin.email.toLowerCase();
            let accesTokenAuthResponse = new AccesTokenAuthAdminResponse();
            let user = await this.storeUserAdmin.getByEmail(userSignin.email);
            if (!user) {
                return (ResponseFailure(400, `User with this email ${userSignin.email} does not exist`))
            }
            else if (await bcrypt.compare(userSignin.password, user.password) == false) {
                return (ResponseFailure(400, `User with this email ${userSignin.email} bad password`))

            }
            else {
                const payload = {
                    admin: user.isAdmin,
                    claims: user.claims,
                    userId: user._id
                };

                const token = jwt.sign(payload, configAuth.secret, {
                    expiresIn: 60 * 60 * 24 * 30 // expires in 30 days
                });
                const refreshToken = randtoken.uid(256);
                user = await this.storeUserAdmin.setAccessToken(user._id.toString(), token, refreshToken);
                if (!user.emailVerificationId)
                    user.emailVerificationId = '';
                accesTokenAuthResponse.user = user;
                accesTokenAuthResponse.access_token = token;
                delete accesTokenAuthResponse.user.password;
                delete accesTokenAuthResponse.user.oldPasswords;
                delete accesTokenAuthResponse.user.accessToken;
                return ResponseSuccess(200, accesTokenAuthResponse);
            }
        }
        catch (error) {
            return ResponseFailure(500, error)
        }
    } */

  async refreshToken(
    userRefresh: UserEmailRefreshTokenAuthRequest,
  ): Promise<IModelResponse> {
    try {
      userRefresh.email = userRefresh.email.toLowerCase();
      let accesTokenAuthResponse = new AccesTokenAuthResponse();
      let user = await this.storeUser.getByEmail(userRefresh.email);
      if (!user) {
        return (ResponseFailure(
          400,
          `User with this email ${userRefresh.email} does not exist`,
        ));
      } else if (
        user._id.toString() != userRefresh.userId ||
        user.refreshToken != userRefresh.refreshToken
      ) {
        return (ResponseFailure(
          400,
          `User with this email ${userRefresh.email} bad informations`,
        ));
      } else {
        const payload = {
          admin: user.isAdmin,
          claims: user.claims,
          userId: user._id,
        };

        const token = jwt.sign(payload, configAuth.secret, {
          expiresIn: 60 * 60 * 2, // expires in 2 hours
        });
        const refreshToken = randtoken.uid(256);
        user = await this.storeUser.setAccessToken(
          user._id.toString(),
          token,
          refreshToken,
        );
        if (!user.emailVerificationId) {
          user.emailVerificationId = "";
        }
        accesTokenAuthResponse.user = user;
        accesTokenAuthResponse.access_token = token;
        delete accesTokenAuthResponse.user.password;
        delete accesTokenAuthResponse.user.oldPasswords;
        delete accesTokenAuthResponse.user.accessToken;
        return ResponseSuccess(200, accesTokenAuthResponse);
      }
    } catch (error) {
      return ResponseFailure(500, error);
    }
  }
}
