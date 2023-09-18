import { Request, Response, NextFunction } from 'express';
import { verifyToken, JwtPayload } from '../../infrastructure/jwtHelper';

export const authenticationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // Get the token from the 'authorization' header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(403).send("Access Denied: No Token Provided!");
        return;
    }

    const decoded = verifyToken(token);
    
    if (!decoded) {
        res.status(400).send("Invalid Token");
        return;
    }

    // Attach the user to the request object
    req.user = decoded as JwtPayload;

    next();
};
