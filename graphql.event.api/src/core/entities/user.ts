import { IUser } from '../interfaces/IUserRepository';

export class User implements IUser {
    id?: string;
    email: string;
    password?: string;  
    passwordHash: string;  
    firstName?: string;
    lastName?: string;

    constructor(email: string, passwordHash: string, firstName?: string, lastName?: string) {
        this.email = email;
        this.passwordHash = passwordHash;
        this.firstName = firstName;
        this.lastName = lastName;
    }

}
