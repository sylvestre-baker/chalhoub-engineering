import { ApiModel, ApiModelProperty } from "swagger-express-ts";

@ApiModel({
    description: "Event Model from DB",
    name: "ModelEvent"
})
export class ModelEvent {
    @ApiModelProperty()
    _id: string;
    @ApiModelProperty()
    name: string;
    @ApiModelProperty()
    body: string;
    @ApiModelProperty()
    timestamp: string;
}
