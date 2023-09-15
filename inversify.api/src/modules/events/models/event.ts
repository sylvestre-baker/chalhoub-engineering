import { ModelEvent } from './db/index';
import { ApiModel, ApiModelProperty, SwaggerDefinitionConstant } from 'swagger-express-ts';
import { IModelResponse } from '../../interfaces/api/index';

@ApiModel({
    description: "Event Response",
    name: "EventResponse"
})
export class EventResponse implements IModelResponse {
    @ApiModelProperty({
        description: "code",
        required: true
    })
    code: number;
    message: string;
    error: string;
    @ApiModelProperty({
        description: "data",
        model: "ModelEvent",
        required: true
    })
    data: ModelEvent;
}

@ApiModel({
    description: "Events Response",
    name: "EventsResponse"
})
export class EventsResponse implements IModelResponse {
    @ApiModelProperty({
        description: "code",
        required: true
    })
    code: number;
    message: string;
    error: string;
    @ApiModelProperty({
        description: "data",
        type: SwaggerDefinitionConstant.Response.Type.ARRAY,
        model : "ModelEvent",
        required: true
    })
    data: ModelEvent[];;
}

@ApiModel({
    description: "Event Error Response",
    name: "EventErrorResponse"
})
export class EventErrorResponse implements IModelResponse {
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
        description: "error"
    })
    error: string;
    data: any;
}


@ApiModel({
    description: "Event Create Request",
    name: "EventCreateRequest"
})
export class EventCreateRequest {
    @ApiModelProperty({
        description: "name",
        required: true
    })
    name: string;
    @ApiModelProperty({
        description: "body",
        required: true
    })
    body: string;
}

@ApiModel({
    description: "Get Event By Id Request",
    name: "EventGetByIdRequest"
})
export class EventGetByIdRequest {
    @ApiModelProperty({
        description: "eventId",
        required: true
    })
    eventId: string;
}