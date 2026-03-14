import { JwtPayload } from 'src/modules/auth/jwt.strategy';

declare global {
  namespace Express {
    interface Request {
      user: JwtPayload;
    }
  }
}
