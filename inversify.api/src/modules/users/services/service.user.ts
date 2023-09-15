
import { injectable, inject } from 'inversify';
import {
    CreateUserRequest,
    UserGetByIdRequest,
    FindUserByEmailRequest,
    EditUserRequest,
    EditUserPasswordRequest,
    FindUserByEmailVerificationIdRequest,
    FindUserByPasswordVerificationIdRequest,
    GetAllUsersWithInfosResponse,
} from '../models'

import { ObjectID } from 'mongodb';

import * as bcrypt from 'bcrypt';


import { TYPES, ResponseFailure, ResponseSuccess, ResponseError } from '../../common';
import {
    StoreUser,
} from './stores';
import {

} from '../models';
import { IModelResponse } from '../../interfaces/api/index';
const sgMail = require('@sendgrid/mail');

@injectable()
export class ServiceUser {
    private smtpTransport = null;
    private htmlResetPassword: string = null;
    constructor(
        @inject(TYPES.StoreUser) private store: StoreUser,
    ) {
        sgMail.setApiKey('XXXX');
    }



    async create(newUser: CreateUserRequest, host: string): Promise<IModelResponse> {
        try {
            let user = await this.store.getByEmail(newUser.email);
            if (user) {
                return ResponseFailure(400, `User with this email ${newUser.email.toLowerCase()} already exists`)
            }

            else {
                user = await this.store.createFull(newUser.firstname, newUser.lastname, newUser.email,
                    newUser.password);

                delete user.emailVerificationId;
                delete user.password;
                delete user.oldPasswords;
                delete user.accessToken;
                return ResponseSuccess(201, user);

            }
        }
        catch (error) {
            return ResponseFailure(500, error)
        }
    }

    async getAll(): Promise<IModelResponse> {
        try {
            const users = await this.store.getAll();

            for (let index = 0; index < users.length; index++) {
                let user = users[index];
                delete user.emailVerificationId;
                delete user.password;
                delete user.oldPasswords;
                delete user.accessToken;
            }

            return ResponseSuccess(200, users);

        }
        catch (error) {
            return ResponseFailure(500, error)
        }
    }

    async countAll(): Promise<IModelResponse> {
        try {
            const users = await this.store.countAll();
            return ResponseSuccess(200, users);

        }
        catch (error) {
            return ResponseFailure(500, error)
        }
    }


    async getAllWithInfos(): Promise<IModelResponse> {
        try {
            const resp = new GetAllUsersWithInfosResponse();
            const users = await this.store.getAll();
            resp.users = users;
            return ResponseSuccess(200, resp);

        }
        catch (error) {
            return ResponseFailure(500, error)
        }
    }

    async find(findUser: UserGetByIdRequest): Promise<IModelResponse> {
        try {
            const user = await this.store.get(findUser.userId);
            if (!user) {
                return ResponseFailure(400, `User with this id ${findUser.userId} not found`)
            }
            else {
                delete user.emailVerificationId;
                delete user.password;
                delete user.oldPasswords;
                delete user.accessToken;
                return ResponseSuccess(200, user);
            }
        }
        catch (error) {
            return ResponseFailure(500, error)
        }
    }

    async findByEmail(findUser: FindUserByEmailRequest): Promise<IModelResponse> {
        try {
            const user = await this.store.getByEmail(findUser.email.toLowerCase());
            if (!user) {
                return ResponseFailure(400, `User with this email ${findUser.email.toLowerCase()} not found`)
            }
            else {
                delete user.emailVerificationId;
                delete user.password;
                delete user.oldPasswords;
                delete user.accessToken;
                return ResponseSuccess(200, user);
            }
        }
        catch (error) {
            return ResponseFailure(500, error)
        }
    }


    async userWithEmailExist(findUser: FindUserByEmailRequest): Promise<IModelResponse> {
        try {
            const user = await this.store.getByEmail(findUser.email.toLowerCase());
            if (!user) {
                return ResponseSuccess(200, false);
            }
            else {
                return ResponseSuccess(200, true);
            }
        }
        catch (error) {
            return ResponseFailure(500, error)
        }
    }

    async update(editUser: EditUserRequest): Promise<IModelResponse> {
        try {
            let user = await this.store.get(editUser.userId);
            if (!user) {
                return ResponseFailure(400, `User with this id ${editUser.userId} not found`)
            }
            else {

                user = await this.store.edit(editUser.userId, editUser.firstname, editUser.lastname);
                delete user.emailVerificationId;
                delete user.password;
                delete user.oldPasswords;
                delete user.accessToken;
                return ResponseSuccess(200, user);
            }
        }
        catch (error) {
            return ResponseFailure(500, error)
        }
    }

    async remove(removeUser: UserGetByIdRequest): Promise<IModelResponse> {
        try {
            let user = await this.store.get(removeUser.userId);
            if (!user) {
                return ResponseFailure(400, `User with this id ${removeUser.userId} not found`)
            }
            else {
                
                const removed = await this.store.delete(removeUser.userId)
                if (removed) {
                    return ResponseSuccess(200, true);
                }
                else {
                    ResponseSuccess(200, false);
                }
            }
        }
        catch (error) {
            return ResponseFailure(500, error)
        }
    }


    async editPassword(editUser: EditUserPasswordRequest): Promise<IModelResponse> {
        try {
            let user = await this.store.get(editUser.userId);
            if (!user) {
                return ResponseFailure(400, `User with this id ${editUser.userId} not found`)
            }
            else {
                if (await bcrypt.compare(editUser.oldPassword, user.password) == false) {
                    return (ResponseFailure(400, `User with this id ${editUser.userId} bad password`))
                }
                else {
                    user = await this.store.editPassword(editUser.userId, editUser.password);
                    return ResponseSuccess(202, true);
                }
            }
        }
        catch (error) {
            return ResponseFailure(500, error)
        }
    }


    async sendEmailVerification(findUser: UserGetByIdRequest, host: string): Promise<IModelResponse> {
        return new Promise<IModelResponse>(async (resolve, reject) => {
            try {
                let user = await this.store.get(findUser.userId);
                if (!user) {
                    resolve(ResponseFailure(400, `User with this id ${findUser.userId} not found`));
                }
                else {
                    user = await this.store.setEmailVerificationId(findUser.userId);
                    const link = "https://" + host + "/auth/verify?id=" + user.emailVerificationId;
                    const mailOptions = {
                        to: user.email,
                        subject: "Please confirm your Email account",
                        html: "Hello,<br> Please Click on the link to verify your email.<br><a href=" + link + ">Click here to verify</a>"
                    }
                    this.smtpTransport.sendMail(mailOptions, async (error, response) => {
                        if (error) {
                            reject(ResponseFailure(500, error));
                        } else {
                            resolve(ResponseSuccess(202, true));
                        }
                    });
                }
            }
            catch (error) {
                return ResponseFailure(500, error)
            }
        });
    }

    async verifyEmail(findUser: FindUserByEmailVerificationIdRequest): Promise<IModelResponse> {
        try {
            let user = await this.store.getByEmailVerificationId(findUser.emailVerificationId);
            if (!user) {
                return ResponseFailure(400, `User with this emailVerificationId ${findUser.emailVerificationId} not found`);
            }
            else {
                user = await this.store.setEmailVerified(user._id.toString());
                return ResponseSuccess(200, true);
            }
        }
        catch (error) {
            return ResponseFailure(500, error)
        }
    }





    async forgetPassword(findUser: FindUserByEmailRequest, host: string): Promise<IModelResponse> {
        return new Promise<IModelResponse>(async (resolve) => {
            findUser.email = findUser.email.toLowerCase();
            let user = await this.store.getByEmail(findUser.email);
            if (!user) {
                resolve(ResponseFailure(400, `User with this email ${findUser.email} not found`))
            }
            else {
                user = await this.store.generatePassword(user._id.toString());
                let body = this.htmlResetPassword.replace('{{PASSWORD_VALUE}}', user.password);
                const msg = {
                    to: user.email,
                    from: 'no-reply@vobo.fr',
                    subject: 'Réinitialisation de votre mot de passe VOBO',
                    //text: 'and easy to do anywhere, even with Node.js',
                    html: body,
                };
                sgMail.send(msg).then(result => {
                    resolve(ResponseSuccess(200, `User with this email ${findUser.email} password reset sent`));
                }, err => {
                    resolve(ResponseFailure(400, `User with this email ${findUser.email} password reset not sent`))
                });
            }
        });
    }

    async sendPasswordVerification(findUser: FindUserByEmailRequest, host: string): Promise<IModelResponse> {
        return new Promise<IModelResponse>(async (resolve) => {
            let user = await this.store.getByEmail(findUser.email);
            if (!user) {
                resolve(ResponseFailure(400, `User with this email ${findUser.email} not found`))
            }
            else {
                user = await this.store.setPasswordVerificationId(user._id.toString());
                const link = "https://" + host + "/auth/resetPassword?passwordVerificationId=" + user.passwordVerificationId;
                const mailOptions = {
                    to: user.email,
                    subject: "Reset password",
                    html: "Hello,<br> Please Click on the link to reset your password.<br><a href=" + link + ">Click here to generate password</a>"
                }
                this.smtpTransport.sendMail(mailOptions, async (error, response) => {
                    if (error) {
                        resolve(ResponseFailure(400, `User with this email ${findUser.email} password reset not sent`))
                    } else {
                        resolve(ResponseSuccess(200, `User with this email ${findUser.email} password reset sent`));
                    }
                });
            }
        });
    }
    async generatePassword(editUser: FindUserByPasswordVerificationIdRequest): Promise<IModelResponse> {
        return new Promise<IModelResponse>(async (resolve) => {
            let user = await this.store.getByPasswordVerificationId(editUser.passwordVerificationId);
            if (!user) {
                resolve(ResponseFailure(400, `User with this passwordVerificationId ${editUser.passwordVerificationId} not found`));
            }
            else {

                user = await this.store.generatePassword(user._id.toString());
                if (user) {
                    const mailOptions = {
                        to: user.email,
                        subject: "New password",
                        html: "Hello,<br> your new password is : <br>" + user.password + "</a>"
                    }
                    this.smtpTransport.sendMail(mailOptions, async (error, response) => {
                        if (error) {
                            resolve(ResponseFailure(400, `User with this email ${user.email} password reset not sent`))
                        } else {
                            resolve(ResponseSuccess(200, `User with this email ${user.email} password reset sent`));
                        }
                    });

                }
                else
                    resolve(null);
            }
        });
    }
}