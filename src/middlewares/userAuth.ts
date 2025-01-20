import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { UserRepository } from '../repositories/userRepository';

dotenv.config();

const jwtSecret = process.env.JWT_SECRET || 'myjwtsecret';

interface JwtPayload {
  role: string;
  id: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload
    }
  }
}

class AuthMiddleware {
  private jwtSecret: string;
  private userRepository: UserRepository;

  constructor(jwtSecret: string, userRepository: UserRepository) {
    this.jwtSecret = jwtSecret;
    this.userRepository = userRepository;
  }

  public verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      return res.status(401).send('Access Denied: No Token Provided!');
    }
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as JwtPayload;
      const userData = await this.userRepository.findUserByEmail(decoded.email);
      if (userData?.is_verified === false) {
        return res.status(401).send('Access Denied: You Are Blocked By Admin!');
      }
      if (decoded) {
        req.user = decoded;
        next();
      } else {
        return res.status(401).send('Access Denied: Invalid Token Or Expired Provided!');
      }
    } catch (error) {
      res.status(400).send('Invalid Token');
    }
  };

  public checkRole = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
      console.log('Data from middleware-->', req.user, roles);
      if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).send('Access Denied: Insufficient Permissions!');
      }
      next();
    };
  };

  public checkAuthorization = (requiredRoles: string[] = []) => {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        const authHeader = req.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return res.status(401).json({ message: 'Access Denied: Invalid Authorization Header!' });
        }
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, this.jwtSecret) as JwtPayload;
        if (!decoded || typeof decoded.role !== 'string') {
          return res.status(400).json({ message: 'Access Denied: Invalid Token Payload!' });
        }
        if (requiredRoles.length && !requiredRoles.includes(decoded.role)) {
          return res.status(403).json({ message: 'Access Denied: Insufficient Permissions!' });
        }
        req.user = decoded;
        next();
      } catch (error) {
        return res.status(401).json({ message: 'Access Denied: Invalid or Expired Token!' });
      }
    };
  };
}

const userRepository = new UserRepository();
const authMiddleware = new AuthMiddleware(jwtSecret, userRepository);

export { authMiddleware };
