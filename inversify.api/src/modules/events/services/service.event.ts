// generate code for this file like service.user.ts file to implement request and response for event from event.ts file and model.event.ts file and store.event.ts file and db/index.ts file and interfaces/api/index.ts file
// Compare this snippet from inversify.api/src/modules/events/services/service.event.ts:

import { injectable, inject } from 'inversify';
import {
    ModelEvent,
    EventResponse,
    EventsResponse,
    EventErrorResponse,
    EventCreateRequest,
    EventGetByIdRequest
} from '../models';
import { TYPES, ResponseFailure, ResponseSuccess, ResponseError } from '../../common';
import {
    StoreEvent,
} from './stores';
import { IModelResponse } from '../../interfaces/api/index';

@injectable()
export class ServiceEvent {
    constructor(
        @inject(TYPES.StoreEvent) private store: StoreEvent,
    ) {
    }

    async create(newEvent : EventCreateRequest) : Promise<IModelResponse> {
        try {
            const event = await this.store.create(newEvent.name, newEvent.body);
            if (event)
                return ResponseSuccess(201, event);
            else
                return ResponseFailure(500, 'Internal Server Error : something went wrong');
        } catch (error) {
            return ResponseFailure(500, 'Internal Server Error : something went wrong');
        }
    }

    async get(getEvent : EventGetByIdRequest) : Promise<IModelResponse> {
        try {
            const event = await this.store.get(getEvent.eventId);
            if (event)
                return ResponseSuccess(200, event);
            else
                return ResponseFailure(404, 'Not Found : event not found');
        } catch (error) {
            return ResponseFailure(500, 'Internal Server Error : something went wrong');
        }
    }

    async getAll() : Promise<IModelResponse> {
        try {
            const events = await this.store.getAll();
            if (events)
                return ResponseSuccess(200, events);
            else
                return ResponseFailure(404, 'Not Found : events not found');
        } catch (error) {
            return ResponseFailure(500, 'Internal Server Error : something went wrong');
        }
    }

}

