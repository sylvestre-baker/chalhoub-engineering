import { interfaces, TYPE } from 'inversify-express-utils';
import { Container } from 'inversify';
import {
    ControllerHome,
    ControllerAuthentification,
    ControllerUser
} from '../controllers';
import { PassportStatic } from 'passport';
import { TAGS } from '../../../modules/common';


export default function configureServices(container: Container, passport: PassportStatic): Container {
    // controllers
    container.bind<interfaces.Controller>(TYPE.Controller).to(ControllerHome).whenTargetNamed(TAGS.ControllerHome);
    container.bind<interfaces.Controller>(TYPE.Controller).to(ControllerAuthentification).whenTargetNamed(TAGS.ControllerAuthentification);
    container.bind<interfaces.Controller>(TYPE.Controller).to(ControllerUser).whenTargetNamed(TAGS.ControllerUser);

    return container;
}