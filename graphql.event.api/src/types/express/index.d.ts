import { JwtPayload } from "../../infrastructure/jwtHelper";

declare module 'express-serve-static-core' {
    interface Request {
        user?: JwtPayload;
    }
}
