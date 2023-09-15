export * from './models';
export * from './services';

import { Container } from 'inversify';

import { TYPES } from '../common';
import { StoreEvent, ServiceEvent } from './services/index';


export function useServiceEvent(container: Container) {
    container.bind<StoreEvent>(TYPES.StoreEvent).to(StoreEvent);
    container.bind<ServiceEvent>(TYPES.ServiceEvent).to(ServiceEvent);
}