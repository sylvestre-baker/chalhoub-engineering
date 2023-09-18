export interface IUser {
    id?: string;
    email: string;
    password?: string;  
    passwordHash: string;  
    firstName?: string;
    lastName?: string;
}

export interface IUserRepository {
    createUser(user: IUser): Promise<IUser>;
    getUserByEmail(email: string): Promise<IUser | null>;
    getUserById(id: string): Promise<IUser | null>;
    getAll(): Promise<IUser[] | null>;
    updateUser(id: string, user: IUser): Promise<IUser | null>;
    deleteUser(id: string): Promise<boolean>;
    verifyPassword(user: IUser, enteredPassword: string): Promise<boolean>;
}
