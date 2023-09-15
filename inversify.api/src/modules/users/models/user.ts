import * as joi from 'joi';
import { Constraint } from '../../common';
import { ModelUser } from './db/index';
import { ApiModel, ApiModelProperty, SwaggerDefinitionConstant } from 'swagger-express-ts';
import { IModelResponse } from '../../interfaces/api/index';

@ApiModel({
    description: "User Response",
    name: "UserResponse"
})
export class UserResponse implements IModelResponse {
    @ApiModelProperty({
        description: "code",
        required: true
    })
    code: number;
    message: string;
    error: string;
    @ApiModelProperty({
        description: "data",
        model: "ModelUser",
        required: true
    })
    data: ModelUser;
}

@ApiModel({
    description: "Get All Users With Infos Response",
    name: "GetAllUsersWithInfosResponse"
})
export class GetAllUsersWithInfosResponse {
    @ApiModelProperty({
        description: "Response ModelUses",
        model: "ModelUser",
        type: SwaggerDefinitionConstant.Response.Type.ARRAY
    })
    users: ModelUser[];
}

@ApiModel({
    description: "Users Response",
    name: "UsersResponse"
})
export class UsersResponse implements IModelResponse {
    @ApiModelProperty({
        description: "code",
        required: true
    })
    code: number;
    message: string;
    error: string;
    @ApiModelProperty({
        description: "data",
        model: "GetAllUsersWithInfosResponse",
        required: true
    })
    data: GetAllUsersWithInfosResponse;
}

@ApiModel({
    description: "User Error Response",
    name: "UserErrorResponse"
})
export class UserErrorResponse implements IModelResponse {
    @ApiModelProperty({
        description: "code",
        required: true
    })
    code: number;
    @ApiModelProperty({
        description: "message"
    })
    message: string;
    @ApiModelProperty({
        description: "error",
        required: true
    })
    error: string;

    data: any;
}


@ApiModel({
    description: "Create User By Email Request description",
    name: "CreateUserByEmailRequest"
})
export class CreateUserByEmailRequest {
    @ApiModelProperty({
        description: "Email",
        required: true
    })
    @Constraint(joi.string().email().required())
    email: string;

    @ApiModelProperty({
        description: "Password",
        required: true
    })
    //@Constraint(joi.string().regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{6,}$/).required())
    @Constraint(joi.string().regex(/^[a-zA-Z0-9$@$!%*#?&]{6,}$/).required())
    password: string;
}



@ApiModel({
    description: "Create User Request description",
    name: "CreateUserRequest"
})
export class CreateUserRequest {
    @ApiModelProperty({
        description: "Firstname",
        required: true
    })
    @Constraint(joi.string().allow('').required())
    firstname: string;

    @ApiModelProperty({
        description: "Lastname",
        required: true
    })
    @Constraint(joi.string().allow('').required())
    lastname: string;

    @ApiModelProperty({
        description: "Email",
        required: true
    })
    @Constraint(joi.string().email().required())
    email: string;

    @ApiModelProperty({
        description: "Password",
        required: true
    })
    //@Constraint(joi.string().regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{6,}$/).required())
    @Constraint(joi.string().regex(/^[a-zA-Z0-9$@$!%*#?&]{6,}$/).required())
    password: string;
}


@ApiModel({
    description: "Find user by email",
    name: "FindUserByEmailRequest"
})
export class FindUserByEmailRequest {
    @ApiModelProperty({
        description: "email",
        required: true
    })
    @Constraint(joi.string().email().required())
    email: string;
}

@ApiModel({
    description: "Find user by userId",
    name: "UserGetByIdRequest"
})
export class UserGetByIdRequest {
    @ApiModelProperty({
        description: "UserId",
        required: true
    })
    @Constraint(joi.string().required())
    userId: string;
}



@ApiModel({
    description: "Edit informations of user by userId",
    name: "EditUserRequest"
})
export class EditUserRequest {
    @ApiModelProperty({
        description: "UserId",
        required: true
    })
    @Constraint(joi.string().required())
    userId: string;

    @ApiModelProperty({
        description: "firstname",
        required: true
    })
    @Constraint(joi.string().required())
    firstname: string;

    @ApiModelProperty({
        description: "lastname",
        required: true
    })
    @Constraint(joi.string().required())
    lastname: string;
}

@ApiModel({
    description: "Edit password of user by userId",
    name: "EditUserPasswordRequest"
})
export class EditUserPasswordRequest {
    @ApiModelProperty({
        description: "userId",
        required: true
    })
    @Constraint(joi.string().required())
    userId: string;

    @ApiModelProperty({
        description: "oldPassword",
        required: true
    })
    @Constraint(joi.string().required())
    oldPassword: string;

    @ApiModelProperty({
        description: "password",
        required: true
    })
    @Constraint(joi.string().regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/).required())
    password: string;
}




@ApiModel({
    description: "Find User By EmailVerificationId Request",
    name: "FindUserByEmailVerificationIdRequest"
})
export class FindUserByEmailVerificationIdRequest {
    @ApiModelProperty({
        description: "emailVerificationId",
        required: true
    })
    @Constraint(joi.string().required())
    emailVerificationId: string;
}

@ApiModel({
    description: "Find User By PasswordVerificationId Request",
    name: "FindUserByPasswordVerificationIdRequest"
})
export class FindUserByPasswordVerificationIdRequest {
    @ApiModelProperty({
        description: "emailVerificationId",
        required: true
    })
    @Constraint(joi.string().required())
    passwordVerificationId: string;
}



