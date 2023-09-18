import axios from 'axios';
const config = require('../config.json');

const BASE_URL = 'http://localhost:8001';

function isErrorWithResponse(error: unknown): error is { response: { status: number } } {
    return !!error && typeof error === 'object' && 'response' in error && error.response !== null && typeof error.response === 'object' && 'status' in error.response;
}


interface UserCredentials {
    email: string;
    password: string;
    firstname?: string;
    lastname?: string;
}
interface SignInCredentials {
    email: string;
    password: string;
}

async function signIn(credentials: SignInCredentials) {
    const response = await axios.post(`${BASE_URL}/auth/signin`, credentials);

    if (response.status !== 200 && response.status !== 201) {
        throw new Error("Sign-in failed");
    }

    return response.data.data.access_token;
}

async function signUp(credentials: UserCredentials) {
    const response = await axios.post(`${BASE_URL}/auth/signup`, credentials);

    if (response.status !== 200 && response.status !== 201) {
        throw new Error("Sign-up failed");
    }

    return response.data.data.access_token;
}

function getRandomElement<T>(array: T[]): T {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}

async function createRandomEvent(token: string) {
    const name = getRandomElement(config.names);
    const product = getRandomElement(config.products);
    const body = getRandomElement(config.bodies);

    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'accept': 'application/json'
    };

    const response = await axios.post(`${BASE_URL}/event`, { name, body }, { headers });

    return response.data;
}

async function createEvent(token: string, name: string, body: string) {
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'accept': 'application/json'
    };

    const response = await axios.post(`${BASE_URL}/event`, { name, body }, { headers });

    return response.data;
}

async function main() {
    try {
        const signUpCredentials: UserCredentials = {
            firstname: 'Sylvestre',
            lastname: 'Franceschi',
            email: 'sylvestre.franceschi@gmail.com',
            password: 'Azerty01!'
        };

        const signInCredentials: SignInCredentials = {
            email: 'sylvestre.franceschi@gmail.com',
            password: 'Azerty01!'
        };

        let token: string;

        try {
            token = await signIn(signInCredentials);
        } catch (error) {
            if (isErrorWithResponse(error) && error.response.status === 401) {
                token = await signUp(signUpCredentials);
            } else {
                throw error;
            }
        }

        setInterval(async () => {
            const eventResponse = await createRandomEvent(token);
            console.log('Event created:', eventResponse);
        }, 500);
    } catch (err) {
        console.error('Error:', err);
    }
}

main();
