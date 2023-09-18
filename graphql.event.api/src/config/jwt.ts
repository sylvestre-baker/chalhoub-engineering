import * as jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key'; // Change 'your_secret_key' to a strong secret key

interface JwtPayload {
    userId: string;
    username: string;
    exp: number;
}

export const generateToken = (payload: Omit<JwtPayload, 'exp'>, expiresIn: string | number = '1h'): string => {
    return jwt.sign({ ...payload, exp: Math.floor(Date.now() / 1000) + (typeof expiresIn === 'string' ? (parseInt(expiresIn) * 60) : expiresIn) }, JWT_SECRET);
}

export const verifyToken = (token: string): JwtPayload | null => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
        return decoded;
    } catch (error) {
        return null;
    }
}

export const decodeToken = (token: string): JwtPayload | null => {
    try {
        const decoded = jwt.decode(token) as JwtPayload;
        return decoded;
    } catch (error) {
        return null;
    }
}
