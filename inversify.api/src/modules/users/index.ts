export * from './models';
export * from './services';

import { Container } from 'inversify';

import { TYPES } from '../common';
import { StoreUser, ServiceUser } from './services/index';


export function useServiceUser(container: Container) {
    container.bind<StoreUser>(TYPES.StoreUser).to(StoreUser);
    container.bind<ServiceUser>(TYPES.ServiceUser).to(ServiceUser);
}