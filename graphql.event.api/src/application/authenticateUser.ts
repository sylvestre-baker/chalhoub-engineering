import { IUserRepository } from '../core/interfaces/IUserRepository';
import { createToken } from '../infrastructure/jwtHelper';

interface AuthenticationRequest {
    email: string;
    password: string;
}

interface AuthenticationResponse {
    token: string;
}

export class AuthenticateUserService {
    private userRepository: IUserRepository;

    constructor(userRepository: IUserRepository) {
        this.userRepository = userRepository;
    }

    async execute(authRequest: AuthenticationRequest): Promise<AuthenticationResponse> {
        //Check first that the email and password are not empty.
        if (!authRequest.email.trim() || !authRequest.password.trim()) {
            throw new Error("L'email et le mot de passe sont nécessaires pour l'authentification.");
        }

        const user = await this.userRepository.getUserByEmail(authRequest.email);

        if (!user) {
            throw new Error("Utilisateur introuvable.");
        }

        const isValidPassword = await this.userRepository.verifyPassword(user, authRequest.password);

        if (!isValidPassword) {
            throw new Error("Mot de passe incorrect.");
        }

        const token = createToken({userId : user.id!, email: user.email });

        return { token };
    }
}
