import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; 

export interface JwtPayload {
    userId: string;
    email: string; // I'm assuming email instead of username based on your Payload interface
    exp?: number;
}

export const createToken = (payload: Omit<JwtPayload, 'exp'>, expiresIn: string | number = '1h'): string => {
    return jwt.sign({ ...payload }, JWT_SECRET, {
        expiresIn
    });
}

export const verifyToken = (token: string): JwtPayload | null => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
        return decoded;
    } catch (err) {
        console.error('JWT verification error:', err);
        return null;
    }
}

export const decodeToken = (token: string): JwtPayload | null => {
    try {
        const decoded = jwt.decode(token) as JwtPayload;
        return decoded;
    } catch (error) {
        console.error('JWT decoding error:', error);
        return null;
    }
}
