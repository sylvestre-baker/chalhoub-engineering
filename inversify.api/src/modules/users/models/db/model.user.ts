import { ApiModel, ApiModelProperty } from "swagger-express-ts";

@ApiModel({
    description: "User Model from DB",
    name: "ModelUser"
})
export class ModelUser {
    @ApiModelProperty()
    _id: string;
    @ApiModelProperty()
    accessToken: string;
    @ApiModelProperty()
    refreshToken: string;
    @ApiModelProperty()
    firstname: string;
    @ApiModelProperty()
    lastname: string;
    @ApiModelProperty()
    email: string;
    @ApiModelProperty()
    claims: ModelClaims = ModelClaims.USER;
    password: string;
    @ApiModelProperty()
    enable: boolean = true;
    @ApiModelProperty()
    emailVerified: boolean = false;
    @ApiModelProperty()
    emailVerificationId: string;
    oldPasswords: string[] = [];
    @ApiModelProperty()
    isAdmin: boolean = false;
    @ApiModelProperty()
    passwordVerificationId: string;
}


@ApiModel({
    description: "User Admin Model from DB",
    name: "ModelUserAdmin"
})
export class ModelUserAdmin {
    @ApiModelProperty()
    _id: string;
    @ApiModelProperty()
    accessToken: string;
    @ApiModelProperty()
    refreshToken: string;
    @ApiModelProperty()
    firstname: string;
    @ApiModelProperty()
    lastname: string;
    @ApiModelProperty()
    email: string;
    @ApiModelProperty()
    claims: ModelClaims = ModelClaims.ADMIN;
    password: string;
    @ApiModelProperty()
    enable: boolean = true;
    @ApiModelProperty()
    emailVerified: boolean = false;
    @ApiModelProperty()
    emailVerificationId: string;
    oldPasswords: string[] = [];
    @ApiModelProperty()
    isAdmin: boolean = true;
}


export enum ModelClaims {
    ADMIN = 'ADMIN',
    USER = 'USER'
}